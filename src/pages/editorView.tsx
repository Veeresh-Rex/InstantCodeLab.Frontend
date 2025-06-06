import Editor from '@monaco-editor/react';
import ActiveMembers from '@/pages/activeMembers';
import { InputOutputTabs } from '@/components/inputOutput';
import EditorLayout from '@/layouts/editorLayout';
import { User } from '@/types/user';

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
  const handleEditorDidMount = (editor: any) => {
    editor.onDidType(() => {
      const fullContent = editor.getValue();
      onChangeCode(fullContent);
    });
  };

  return (
    <EditorLayout
      chatRoom={currentUser.joinedLabRoomName}
      userName={currentUser.username}
      showNavbar={true}>
      <div className='flex flex-row'>
        <div className='basis-5/6 mr-2'>
          <Editor
            defaultLanguage='javascript'
            defaultPath='file.js'
            height='93vh'
            theme='vs-dark'
            value={code}
            onMount={handleEditorDidMount}
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
            <InputOutputTabs />
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
