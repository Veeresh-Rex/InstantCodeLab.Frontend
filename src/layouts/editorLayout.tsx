import { EditorNavbar } from '@/components/editornavbar';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col h-screen'>
      <EditorNavbar />
      <main className='w-screen'>{children}</main>
    </div>
  );
}
