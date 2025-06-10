import { EditorNavbar } from '@/components/editornavbar';

export default function EditorLayout({
  children,
  userName,
  chatRoom,
  showNavbar = true,
  handleCodeRunner,
  handleCodeDownload,
}: {
  children: React.ReactNode;
  userName: string | undefined;
  chatRoom: string | undefined;
  showNavbar: boolean;
  handleCodeRunner?: () => void;
  handleCodeDownload?: () => void;
}) {
  return (
    <div className='flex flex-col h-screen'>
      <>
        {showNavbar && (
          <EditorNavbar
            userName={userName ?? ''}
            chatRoom={chatRoom ?? ''}
            handleCodeRunner={handleCodeRunner}
            handleCodeDownload={handleCodeDownload}
          />
        )}
        <main className='w-screen'>{children}</main>
      </>
    </div>
  );
}
