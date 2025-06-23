import Editor from '@monaco-editor/react';
import ActiveMembers from '@/pages/activeMembers';
import { InputOutputTabs } from '@/components/inputOutput';
import EditorLayout from '@/layouts/editorLayout';
import { User } from '@/types/userTypes';
import { CompileResponseDto } from '@/types/compiler';
import { compileTheCode } from '@/services/compilerService';
import { LanguageCode } from '@/constant/enums';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSignalR } from '@/hooks/useSignalR';
import connection from '@/services/signalRClient';
import { stopConnection } from '@/services/signalRService';
import { useNavigate } from 'react-router-dom';
import { addToast } from '@heroui/react';
import { clearUserInfo } from '@/services/userService';
import { mapToMonacoLanguage } from '@/constant/constant';

type EditorViewProps = {
  currentUser: User;
  pairedUser?: User;
  users: User[];
  setAllUsers: (user: User[]) => void;
  setPairedUser: (user: User | undefined) => void;
  languageCode: LanguageCode;
};

export const EditorView: React.FC<EditorViewProps> = ({
  currentUser,
  pairedUser,
  users,
  setAllUsers,
  setPairedUser,
  languageCode,
}) => {
  const [response, setResponse] = useState<CompileResponseDto | null>();
  const lastValueRef = useRef<string>('');
  const [language, setLanguage] = useState<LanguageCode>(languageCode);
  const pairedUserRef = useRef<User | undefined>(pairedUser);
  const editorRef = useRef<any>(null);
  const suppressNextChangeRef = useRef(false);
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set([currentUser.id])
  );

  // Keep pairedUserRef in sync with prop
  useEffect(() => {
    pairedUserRef.current = pairedUser;
  }, [pairedUser]);

  // Receive code changes
  useSignalR<string>(
    'ReceiveCodeChange',
    useCallback((updatedCode) => {
      if (editorRef.current) {
        suppressNextChangeRef.current = true;
        editorRef.current.setValue(updatedCode);
      }
      lastValueRef.current = updatedCode;
    }, [])
  );

  useSignalR<null>(
    'RoomIsDeleted',
    useCallback(() => {
      clearUserInfo();
      addToast({
        color: 'danger',
        title: 'Room Deleted',
        description: 'The room you were in has been deleted.',
      });
      stopConnection();
      navigate('/');
    }, [])
  );

  useSignalR<LanguageCode>(
    'LanguageChanged',
    useCallback((updatedLanguage) => {
      addToast({
        color: 'warning',
        title: 'Language Changed',
        description: `The language has been changed to ${updatedLanguage}.`,
      });

      console.log('Language changed to: ', updatedLanguage);

      setLanguage(updatedLanguage);
    }, [])
  );

  useSignalR<string>(
    'UserLeft',
    useCallback(
      async (userId) => {
        const leftUser = users.find((user) => user.id === userId);
        const IsYouRemoved = currentUser?.id === userId;

        if (IsYouRemoved) {
          addToast({
            color: 'danger',
            title: 'You have been removed',
            description: `You have been removed from the session by the admin.`,
          });
          await stopConnection();
          navigate('/');
          return;
        }

        addToast({
          color: 'warning',
          title: 'User Left',
          description: `User ${leftUser?.username} has left the session.`,
        });

        setSelectedKeys(new Set([currentUser.id]));
        const updatedUser = users.filter((user) => user.id !== userId);
        setAllUsers(updatedUser);
      },
      [currentUser, users]
    )
  );

  function sendUpdatedText(value?: string): void {
    if (suppressNextChangeRef.current) {
      suppressNextChangeRef.current = false;
      return;
    }
    lastValueRef.current = value || '';
    connection.invoke('SendCodeChange', pairedUserRef.current?.id, value);
  }

  // Handle active member selection
  const handleChangeUser = useCallback(
    async (activeUserSet: Set<string>) => {
      const connectedUser = users.find(
        (e) => e.id === (Array.from(activeUserSet)[0] || currentUser.id)
      );
      setSelectedKeys(activeUserSet);
      try {
        setPairedUser(connectedUser);
        pairedUserRef.current = connectedUser;
        await connection.invoke('SwitchToEditor', connectedUser?.id);
        addToast({
          color: 'success',
          title: 'Switched Editor to ' + connectedUser?.username,
        });
      } catch (error) {
        addToast({
          color: 'danger',
          title: 'Error from server',
          description: 'Failed to switch editor',
        });
        setSelectedKeys(new Set([currentUser.id]));
      }
    },
    [users, pairedUser]
  );

  const HandleCodeRunner = async () => {
    const response = await compileTheCode({
      code: lastValueRef.current,
      stdinInput: '',
      language: LanguageCode.NodeJs,
    });
    setResponse(response);
  };

  const handleCodeDownload = () => {
    const blob = new Blob([lastValueRef.current], {
      type: 'text/plain;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'code.txt';
    link.click();
  };

  return (
    <EditorLayout
      chatRoom={currentUser.joinedLabRoomName}
      userName={currentUser.username}
      showNavbar={true}
      handleCodeRunner={HandleCodeRunner}
      handleCodeDownload={handleCodeDownload}
      languageCode={language}>
      <div className='flex flex-row'>
        <div className='basis-5/6 mr-2'>
          <Editor
            defaultLanguage={mapToMonacoLanguage(language)}
            defaultPath='file.js'
            height='93vh'
            theme='vs-dark'
            onChange={sendUpdatedText}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              fontSize: 16,
              minimap: { enabled: true },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              autoIndent: 'full',
              formatOnPaste: true,
              readOnly:
                currentUser.id === pairedUser?.id ? false : pairedUser?.isAdmin,
            }}
          />
        </div>
        <div className='basis-1/6 flex flex-col mr-2'>
          <div className='h-50'>
            <InputOutputTabs output={response} />
          </div>
          <div className='h-5/6 overflow-y-auto'>
            <ActiveMembers
              currentUser={currentUser}
              handleChangeUser={handleChangeUser}
              users={users}
              selectedKeys={selectedKeys}
            />
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};
