import Editor from '@monaco-editor/react';
import ActiveMembers from '@/pages/activeMembers';
import { InputOutputTabs } from '@/components/inputOutput';
import EditorLayout from '@/layouts/editorLayout';
import { User } from '@/types/userTypes';
import { CompileResponseDto } from '@/types/compiler';
import { compileTheCode } from '@/services/compilerService';
import { LanguageCode } from '@/constant/enums';
import { useState } from 'react';

type EditorViewProps = {
  code: string;
  currentUser: User;
  pairedUser?: User;
  users: User[];
  onChangeCode: (value: string | undefined) => void;
  onChangeUser: (userId: string) => void;
};

export const EditorView: React.FC<EditorViewProps> = ({
  code,
  currentUser,
  pairedUser,
  users,
  onChangeCode,
  onChangeUser,
}) => {
  const [response, setResponse] = useState<CompileResponseDto | null>();

  const HandleCodeRunner = async () => {
    console.log('Running code...', code);

    const response = await compileTheCode({
      code,
      stdinInput: '',
      language: LanguageCode.NodeJs,
    });
    console.log('Code run response:', response);
    setResponse(response);
  };

  const handleCodeDownload = () => {};

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
            value={code}
            onChange={onChangeCode}
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
              handleChangeUser={onChangeUser}
              users={users}
            />
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};
