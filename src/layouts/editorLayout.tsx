import { EditorNavbar } from '@/components/editornavbar';

export default function EditorLayout({
  children,
  userName = undefined,
  chatRoom = undefined,
  showNavbar = true,
}: {
  children: React.ReactNode;
  userName: string | undefined;
  chatRoom: string | undefined;
  showNavbar: boolean;
}) {
  return (
    <div className='flex flex-col h-screen'>
      <>
        {showNavbar && (
          <EditorNavbar
            userName={userName ?? ''}
            chatRoom={chatRoom ?? ''}
          />
        )}
        <main className='w-screen'>{children}</main>
      </>
    </div>
  );
}
