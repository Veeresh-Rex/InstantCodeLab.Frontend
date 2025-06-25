import { CompileResponseDto } from '@/types/compiler';
import { Textarea } from '@heroui/input';
import { Tab, Tabs } from '@heroui/tabs';
import { FileInput, FileOutput } from 'lucide-react';
import { useEffect, useState } from 'react';

type InputOutputTabsProps = {
  output?: CompileResponseDto | null;
};

export const InputOutputTabs: React.FC<InputOutputTabsProps> = ({ output }) => {
  const [selected, setSelected] = useState('input');

  useEffect(() => {
    if (output?.output) {
      setSelected('output');
    } else {
      setSelected('input');
    }
  }, [output?.output]);

  return (
    <Tabs
      aria-label='Options'
      radius='full'
      color='primary'
      selectedKey={selected}
      onSelectionChange={(key) => {
        setSelected(key as string);
      }}>
      <Tab
        key='input'
        title={
          <div className='flex items-center space-x-2'>
            <FileInput />
            <span>Input</span>
          </div>
        }>
        <Textarea
          classNames={{
            base: 'max-w-xs',
            input: 'resize-y min-h-[25vh]',
          }}
          placeholder='Enter your code input'
          variant='bordered'
        />
      </Tab>
      <Tab
        key='output'
        title={
          <div className='flex items-center space-x-2'>
            <FileOutput />
            <span>Output</span>
          </div>
        }>
        <Textarea
          isReadOnly
          classNames={{
            base: 'max-w-xs',
            input: 'resize-y min-h-[25vh]',
          }}
          placeholder='Read your output'
          variant='bordered'
          value={output?.output || ''}
          isInvalid={output?.isError}
        />
      </Tab>
    </Tabs>
  );
};
