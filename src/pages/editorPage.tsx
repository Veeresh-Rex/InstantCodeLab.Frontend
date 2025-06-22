import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner as Loader } from '@heroui/spinner';

import Spinner from './spinner';

import ModalPart from '@/components/modal';
import EditorLayout from '@/layouts/editorLayout';
import { useSignalR } from '@/hooks/useSignalR';
import { invokeMethod } from '@/services/signalRService';
import { User } from '@/types/userTypes';
import { getRoom } from '@/services/labRoomService';
import { GetRoomDto } from '@/types/labRoom';
import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';
import { saveUserInfo } from '@/services/userService';
import { useApi } from '@/hooks/useApi';
import { EditorView } from './editorView';

const EditorPage: React.FC<EditorProps> = ({ IsAdmin = false }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { id } = useParams();
  const [pairedUser, setPairedUser] = useState<User | undefined>();

  const { data: currentRoom, loading } = useApi<GetRoomDto>(
    () => getRoom(id || ''),
    [id]
  );

  useSignalR<User[]>(
    'UserJoined',
    useCallback((joinedUsers) => {
      setAllUsers(joinedUsers);
    }, [])
  );

  // Set current user and code
  const handleUserlogin = useCallback(
    async (response: User) => {
      setCurrentUser(response);
      setPairedUser(response);
      saveUserInfo(response);
      await invokeMethod('UserJoined', response?.joinedLabRoomId, response.id);
    },
    [pairedUser]
  );

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
      currentUser={currentUser}
      users={allUsers}
      setPairedUser={setPairedUser}
      setAllUsers={setAllUsers}
      pairedUser={pairedUser}
    />
  );
};

export default EditorPage;

export type EditorProps = {
  IsAdmin: boolean;
};
