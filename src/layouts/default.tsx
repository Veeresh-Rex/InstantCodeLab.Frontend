import { EditorNavbar } from '@/components/editornavbar';
import { Navbar } from '@/components/navbar';

export default function DefaultLayout({
  children,
  isEditorLayout = false,
}: {
  children: React.ReactNode;
  isEditorLayout?: boolean;
}) {
  return (
    <div className='relative flex flex-col h-screen'>
      {isEditorLayout ? <EditorNavbar /> : <Navbar />}
      {isEditorLayout ? (
        <main>{children}</main>
      ) : (
        <main className='container mx-auto max-w-7xl px-6 flex-grow pt-16'>
          {children}
        </main>
      )}
      {!isEditorLayout && (
        <footer className='w-full flex items-center justify-center py-3'>
          <div className='flex items-center gap-1 text-current'>
            <span className='text-default-600'>Made with ⚡</span>
            <p className='text-primary'>by Veeresh</p>
          </div>
        </footer>
      )}
    </div>
  );
}
