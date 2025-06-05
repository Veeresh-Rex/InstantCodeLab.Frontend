import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner as Loader } from '@heroui/spinner';

import connection from '../services/signalRClient';

import Spinner from './spinner';

import ModalPart from '@/components/modal';
import EditorLayout from '@/layouts/editorLayout';
import { useSignalR } from '@/hooks/useSignalR';
import { invokeMethod } from '@/services/signalRService';
import { User } from '@/types/user';
import { getRoom } from '@/services/labRoomService';
import { GetRoomDto } from '@/types/labRoom';
import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';
import { saveUserInfo } from '@/services/userService';
import { useApi } from '@/hooks/useApi';
import { EditorView } from './editorView';

const EditorPage: React.FC<EditorProps> = ({ IsAdmin = false }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [code, setCode] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pairedUser, setPairedUser] = useState<User | undefined>();
  const { id } = useParams();

  const {
    data: currentRoom,
    loading,
    error,
  } = useApi<GetRoomDto>(() => getRoom(id || ''), [id]);

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
    useCallback((userId) => {
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    }, [])
  );

  // Send code changes to server
  const sendMessage = useCallback(
    async (value: string | undefined) => {
      if (value === undefined) return;

      setCode(value);
      try {
        if (connection) {
          console.log('Sending code change: ', value);
          await invokeMethod('SendCodeChange', pairedUser?.id, value);
        }
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    },
    [pairedUser]
  );

  // Handle active member selection
  const handleChangeUser = useCallback(
    async (activeUserSet: string) => {
      const connectedUser = allUsers.find((e) => e.id === activeUserSet);
      await connection.invoke('SwitchToEditor', activeUserSet);
      setPairedUser(connectedUser);
    },
    [allUsers]
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
      pairedUser={pairedUser}
    />
  );
};

export default EditorPage;

export type EditorProps = {
  IsAdmin: boolean;
};
