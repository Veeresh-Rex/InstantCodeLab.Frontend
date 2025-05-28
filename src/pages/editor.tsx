import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { Spinner as Loader } from '@heroui/spinner';

import connection from '../services/signalRClient';

import ActiveMembers from './activeMembers';
import Spinner from './spinner';

import ModalPart from '@/components/modal';
import EditorLayout from '@/layouts/editorLayout';
import { InputOutputTabs } from '@/components/inputOutput';
import { useSignalR } from '@/hooks/useSignalR';
import { invokeMethod } from '@/services/signalRService';
import { LabLoginResponseDto, User } from '@/types/user';
import { getRoom } from '@/services/labRoomService';
import { GetRoomDto } from '@/types/labRoom';
import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';
import { saveUserInfo } from '@/services/userService';

const EditorPage: React.FC<EditorProps> = ({ IsAdmin = false }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [pairedUser, SetPairedUser] = useState<User | undefined>();
  const { id } = useParams();
  const [currentRoom, setCurrentRoom] = useState<GetRoomDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getRoom(id || '');

        setCurrentRoom(data);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);
  // Receive code changes
  useSignalR<string>(
    'ReceiveMessage',
    useCallback((incomingCode) => {
      setCode(incomingCode);
    }, [])
  );

  // Receive active members list
  useSignalR<User[]>(
    'UserJoinedRoom',
    useCallback((joinedUsers) => {
      console.log('joinedUsers: ', joinedUsers);
      setUsers(joinedUsers);
    }, [])
  );

  // Send code changes to server
  const sendMessage = useCallback(async (value: string | undefined) => {
    if (value === undefined) return;

    setCode(value);
    try {
      if (connection) {
        await invokeMethod('SendCode', value);
      }
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }, []);

  // Handle active member selection
  const handleChangeUser = useCallback(async (activeUserSet: string) => {
    await connection.invoke('JoinPairCoding', activeUserSet);

    console.log('activeUserSet', activeUserSet);
    console.log('User', users);

    SetPairedUser(users.find((e) => e.id === activeUserSet));
  }, []);

  // Set current user and code
  const handleCurrentUserChange = useCallback(
    (response: LabLoginResponseDto) => {
      const user: User = {
        id: response.id,
        username: response.username,
        code: response.code,
        joinedLabRoomId: response.labRoomName,
        isAdmin: response.isAdmin,
        userType: 0,
      };
      setCurrentUser(user);
      setCode(response.code);
      saveUserInfo(user); // save user info to local storage
    },
    []
  );

  if (loading)
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

  if (!loading && !currentRoom)
    return (
      <DefaultLayout>
        <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
          <div className='inline-block max-w-lg text-center justify-center'>
            <h1 className={title()}>Oops, No room found 😣</h1>
          </div>
        </section>
      </DefaultLayout>
    );

  //No user logged in
  if (!currentUser) {
    return (
      <EditorLayout chatRoom='' showNavbar={true} userName=''>
        <ModalPart
          isAdmin={IsAdmin}
          roomDetails={currentRoom}
          setCurentUserData={handleCurrentUserChange}
        />
        <Spinner />
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      chatRoom={currentUser.joinedLabRoomId}
      userName={currentUser.username}>
      <div className='flex flex-row'>
        <div className='basis-5/6 mr-2'>
          {console.log('pairedUser?.isAdmin: ', pairedUser?.isAdmin)}
          <Editor
            defaultLanguage='javascript'
            defaultPath='file.js'
            height='93vh'
            options={{
              fontSize: 16,
              minimap: { enabled: true },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              autoIndent: 'full',
              formatOnPaste: true,
              readOnly: pairedUser?.isAdmin,
            }}
            theme='vs-dark'
            value={code}
            onChange={sendMessage}
          />
        </div>

        <div className='basis-1/6 flex flex-col mr-2'>
          <div className='h-50'>
            <InputOutputTabs />
          </div>
          <div className='h-5/6 overflow-y-auto'>
            <ActiveMembers
              defaultSelected={currentUser.id}
              handleChangeUser={handleChangeUser}
              users={users}
            />
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};

export default EditorPage;

export type EditorProps = {
  // other props
  IsAdmin: boolean;
};
