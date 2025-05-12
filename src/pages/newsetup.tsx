import React from 'react';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { InputOtp } from '@heroui/input-otp';

import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';

export default function App() {
  const [action, setAction] = React.useState('');

  return (
    <DefaultLayout>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='inline-block max-w-lg text-center justify-center'>
          <h1 className={title()}>Create your new lab</h1>
          <Form
            className='w-full max-w-100 flex flex-col gap-4 mt-16'
            onReset={() => setAction('reset')}
            onSubmit={(e) => {
              e.preventDefault();
              let data = Object.fromEntries(new FormData(e.currentTarget));

              setAction(`submit ${JSON.stringify(data)}`);
            }}>
            <Input
              isRequired
              errorMessage='Please enter lab name'
              label='Labname'
              labelPlacement='outside'
              name='Labname'
              placeholder='Enter lab name'
              type='text'
            />
            <Input
              isRequired
              label='Password'
              labelPlacement='outside'
              minLength={4}
              name='email'
              placeholder='Enter your password'
              type='password'
            />
            <div className='flex flex-col items-start gap-2'>
              <div className='text-small'>Admin PIN</div>
              <InputOtp length={4} variant='faded' type='password' />
            </div>
            <Button color='primary' type='submit'>
              Submit
            </Button>
          </Form>
        </div>
      </section>
    </DefaultLayout>
  );
}
