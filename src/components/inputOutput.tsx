import { CompileResponseDto } from '@/types/compiler';
import { Textarea } from '@heroui/input';
import { Tab, Tabs } from '@heroui/tabs';

type InputOutputTabsProps = {
  output?: CompileResponseDto | null;
};

export const InputOutputTabs: React.FC<InputOutputTabsProps> = ({ output }) => {
  return (
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
          value={output?.output || ''}
          isInvalid={output?.isError}
        />
      </Tab>
    </Tabs>
  );
};
