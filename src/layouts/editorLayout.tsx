import { EditorNavbar } from '@/components/editornavbar';
import { LanguageCode } from '@/constant/enums';

export default function EditorLayout({
  children,
  userName,
  chatRoom,
  showNavbar = true,
  handleCodeRunner,
  handleCodeDownload,
  languageCode,
}: {
  children: React.ReactNode;
  userName: string | undefined;
  chatRoom: string | undefined;
  showNavbar: boolean;
  handleCodeRunner?: () => void;
  handleCodeDownload?: () => void;
  languageCode: LanguageCode;
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
            languageCode={languageCode}
          />
        )}
        <main className='w-screen'>{children}</main>
      </>
    </div>
  );
}
