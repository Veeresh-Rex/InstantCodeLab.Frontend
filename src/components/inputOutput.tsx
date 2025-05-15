import { Textarea } from '@heroui/input';
import { Tab, Tabs } from '@heroui/tabs';

export const InputOutputTabs = () => {
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
        />
      </Tab>
    </Tabs>
  );
};
