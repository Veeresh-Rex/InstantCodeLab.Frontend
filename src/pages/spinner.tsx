import { Spacer, Card } from '@heroui/react';

export const CustomCard = () => (
  <Card className='w-[40vw] space-y-5 p-4' radius='lg'>
    <div className='h-[100vh] rounded--30' />
    <div className='space-y-3'>
      <div className='h-3 w-3/5 rounded-lg' />
      <div className='h-3 w-4/5 rounded-lg' />
      <div className='h-3 w-2/5 rounded-lg' />
    </div>
  </Card>
);

export default function Spinner() {
  return (
    <div className='flex'>
      <CustomCard />
      <Spacer x={4} />
      <CustomCard />
      <Spacer x={4} />
      <CustomCard />
    </div>
  );
}
