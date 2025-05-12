import EditorNavbar from '@/layouts/editorLayout';
import Editor from '@monaco-editor/react';
import { Tabs, Tab } from '@heroui/tabs';
import { Textarea } from '@heroui/input';
import ModalPart from '@/components/modal';
import ActiveMembers from './activeMembers';
import React from 'react';
import EditorLayout from '@/layouts/editorLayout';

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='ml-2 border-large py-2 rounded-small border-default-200 dark:border-default-100'>
    {children}
  </div>
);

export default function EditorPage() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['text']));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', '),
    [selectedKeys]
  );

  return (
    <EditorLayout>
      <ModalPart />
      <div className='flex flex-row'>
        <div className='basis-5/6 mr-2'>
          <Editor
            theme='vs-dark'
            height='93vh'
            width={'100%'}
            defaultLanguage='javascript'
            defaultPath='file.js'
            defaultValue='// start typing your code here'
            options={{
              fontSize: 16,
              minimap: {
                enabled: true,
              },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              autoIndent: 'full',
              formatOnPaste: true,
              readOnly: false,
            }}
          />
        </div>

        <div className='basis-1/6 flex flex-col mr-2'>
          <div className='h-50'>
            <Tabs aria-label='Options'>
              <Tab key='Input' title='Input'>
                <Textarea
                  classNames={{
                    base: 'max-w-xs',
                    input: 'resize-y min-h-[25vh]',
                  }}
                  placeholder='Enter your code input'
                  variant='bordered'
                />
              </Tab>
              <Tab key='Output' title='Output'>
                <Textarea
                  isReadOnly
                  classNames={{
                    base: 'max-w-xs',
                    input: 'resize-y min-h-[25vh]',
                  }}
                  placeholder='Read your output'
                  variant='bordered'
                />
              </Tab>
            </Tabs>
          </div>
          <div className='h-5/6 overflow-y-auto'>
            <ActiveMembers />
          </div>
        </div>
      </div>
    </EditorLayout>
  );
}
