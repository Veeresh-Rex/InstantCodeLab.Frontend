import Editor, { OnMount } from '@monaco-editor/react';
import ActiveMembers from '@/pages/activeMembers';
import { InputOutputTabs } from '@/components/inputOutput';
import EditorLayout from '@/layouts/editorLayout';
import { User } from '@/types/userTypes';
import { CompileResponseDto } from '@/types/compiler';
import { compileTheCode } from '@/services/compilerService';
import { LanguageCode } from '@/constant/enums';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Y from 'yjs';
import { useSignalR } from '@/hooks/useSignalR';
import connection from '@/services/signalRClient';
import { MonacoBinding } from 'y-monaco';

type EditorViewProps = {
  currentUser: User;
  pairedUser?: User;
  users: User[];
  setPairedUser: (user: User | undefined) => void;
};

export const EditorView: React.FC<EditorViewProps> = ({
  currentUser,
  pairedUser,
  users,
  setPairedUser,
}) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const monacoEditorRef = useRef<any>(null);

  const [response, setResponse] = useState<CompileResponseDto | null>();
  const lastValueRef = useRef<string>('');
  const pairedUserRef = useRef<User | undefined>(pairedUser);

  // Keep pairedUserRef in sync with prop
  useEffect(() => {
    pairedUserRef.current = pairedUser;
  }, [pairedUser]);

  // Receive code changes
  useSignalR<number[]>(
    'ReceiveCodeChange',
    useCallback((updatedCode) => {
      const binaryUpdate = new Uint8Array(updatedCode);
      var string = new TextDecoder().decode(binaryUpdate);
      console.log('Received code update from server: ', string);
      Y.applyUpdate(ydoc, binaryUpdate);
    }, [])
  );

  useEffect(() => {
    if (!connection) return;

    const handleUpdate = (update: Uint8Array) => {
      var string = new TextDecoder().decode(update);
      console.log('Sending code update to server: ', string);
      
      connection.invoke(
        'SendCodeChange',
        pairedUserRef.current?.id,
        Array.from(update)
      );
    };

    ydoc.on('update', handleUpdate);

    return () => {
      ydoc.off('update', handleUpdate);
    };
  }, [connection, ydoc]);

  const handleEditorMount: OnMount = (editor, _monacoInstance) => {
    monacoEditorRef.current = editor;

    const yText = ydoc.getText('instantcodelab');

    new MonacoBinding(yText, editor.getModel()!, new Set([editor]), null);
  };

  // Handle active member selection
  const handleChangeUser = useCallback(
    async (activeUserSet: string) => {
      const connectedUser = users.find((e) => e.id === activeUserSet);
      try {
        setPairedUser(connectedUser);
        pairedUserRef.current = connectedUser;
        await connection.invoke('SwitchToEditor', activeUserSet);
      } catch (error) {
        console.error('Error switching to editor:', error);
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
    console.log('Code run response:', response);
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
      handleCodeDownload={handleCodeDownload}>
      <div className='flex flex-row'>
        <div className='basis-5/6 mr-2'>
          <Editor
            defaultLanguage='javascript'
            defaultPath='file.js'
            height='93vh'
            theme='vs-dark'
            onMount={handleEditorMount}
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
            />
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};
