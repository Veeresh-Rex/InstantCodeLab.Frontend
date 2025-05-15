import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';

import connection from '../services/signalRClient';

import ActiveMembers from './activeMembers';
import Spinner from './spinner';
import ModalPart from '@/components/modal';
import EditorLayout from '@/layouts/editorLayout';
import { InputOutputTabs } from '@/components/inputOutput';
import { useSignalR } from '@/hooks/useSignalR';
import { invokeMethod } from '@/services/signalRService';
import { User } from '@/types/User';
import { useParams } from 'react-router-dom';
import { getRoom } from '@/services/labRoomService';
import { GetRoomDto } from '@/types/labRoom';
import { Spinner as Loader } from '@heroui/spinner';
import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';

const EditorPage: React.FC<EditorProps> = ({ IsAdmin = false }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
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
  }, []);

  // Set current user and code
  const handleCurrentUserChange = useCallback((user: User) => {
    setCurrentUser(user);
    setCode(user.code);
  }, []);

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

  if (!currentUser) {
    return (
      <EditorLayout userName='' chatRoom='' showNavbar={true}>
        <ModalPart setCurentUserData={handleCurrentUserChange} />
        <Spinner />
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      chatRoom={currentUser.labRoomName}
      userName={currentUser.username}>
      <div className='flex flex-row'>
        <div className='basis-5/6 mr-2'>
          <Editor
            defaultLanguage='javascript'
            defaultPath='file.js'
            value={code}
            height='93vh'
            options={{
              fontSize: 16,
              minimap: { enabled: true },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              autoIndent: 'full',
              formatOnPaste: true,
              readOnly: false,
            }}
            theme='vs-dark'
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
