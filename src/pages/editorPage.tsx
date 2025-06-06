import React, { useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner as Loader } from '@heroui/spinner';

import connection from '../services/signalRClient';

import Spinner from './spinner';

import ModalPart from '@/components/modal';
import EditorLayout from '@/layouts/editorLayout';
import { useSignalR } from '@/hooks/useSignalR';
import { invokeMethod, stopConnection } from '@/services/signalRService';
import { User } from '@/types/user';
import { getRoom } from '@/services/labRoomService';
import { GetRoomDto } from '@/types/labRoom';
import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';
import { saveUserInfo } from '@/services/userService';
import { useApi } from '@/hooks/useApi';
import { EditorView } from './editorView';
import { useNavigate } from 'react-router-dom';

const EditorPage: React.FC<EditorProps> = ({ IsAdmin = false }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [code, setCode] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pairedUser, setPairedUser] = useState<User | undefined>();
  const { id } = useParams();
  const navigate = useNavigate();
  const pairedUserRef = useRef<User | undefined>();

  const { data: currentRoom, loading } = useApi<GetRoomDto>(
    () => getRoom(id || ''),
    [id]
  );

  // Receive code changes
  useSignalR<string>(
    'ReceiveCodeChange',
    useCallback((newCode) => {
      setCode(newCode);
    }, [])
  );

  useSignalR<User[]>(
    'UserJoined',
    useCallback((joinedUsers) => {
      setAllUsers(joinedUsers);
    }, [])
  );

  useSignalR<string>(
    'UserLeft',
    useCallback(
      async (userId) => {
        setAllUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );

        if (currentUser?.id === userId) {
          navigate('/');
          await stopConnection();
        }
      },
      [currentUser]
    )
  );

  // Send code changes to server
  const sendMessage = async (value: string | undefined) => {
    if (value === undefined) return;

    setCode(value);
    try {
      if (connection) {
        console.log('User is paired with: ', pairedUserRef.current);
        await invokeMethod('SendCodeChange', pairedUserRef.current?.id, value);
      }
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  // Handle active member selection
  const handleChangeUser = useCallback(
    async (activeUserSet: string) => {
      const connectedUser = allUsers.find((e) => e.id === activeUserSet);
      console.log('Connected User:', connectedUser);
      try {
        setPairedUser(connectedUser);
        pairedUserRef.current = connectedUser;
        await connection.invoke('SwitchToEditor', activeUserSet);
      } catch (error) {
        console.error('Error switching to editor:', error);
      }
    },
    [allUsers, pairedUser]
  );

  // Set current user and code
  const handleUserlogin = useCallback(async (response: User) => {
    setCurrentUser(response);
    setPairedUser(response);
    setCode(response.code);
    saveUserInfo(response);
    await invokeMethod('UserJoined', response?.joinedLabRoomId, response.id);
  }, []);

  if (loading) {
    return (
      <DefaultLayout>
        <div className='h-screen flex items-center justify-center'>
          <Loader
            classNames={{ label: 'text-foreground mt-4' }}
            label='loading...'
            variant='gradient'
          />
        </div>
      </DefaultLayout>
    );
  }

  if (!currentUser) {
    return (
      <EditorLayout showNavbar chatRoom='' userName=''>
        <ModalPart
          isAdmin={IsAdmin}
          roomDetails={currentRoom}
          setCurentUserData={handleUserlogin}
        />
        <Spinner />
      </EditorLayout>
    );
  }

  if (!currentRoom) {
    return (
      <DefaultLayout>
        <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
          <div className='inline-block max-w-lg text-center justify-center'>
            <h1 className={title()}>Oops, No room found 😣</h1>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <EditorView
      code={code}
      currentUser={currentUser}
      users={allUsers}
      onChangeCode={sendMessage}
      onChangeUser={handleChangeUser}
      pairedUser={pairedUserRef.current}
    />
  );
};

export default EditorPage;

export type EditorProps = {
  IsAdmin: boolean;
};
