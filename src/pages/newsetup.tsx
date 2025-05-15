import React from 'react';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { InputOtp } from '@heroui/input-otp';

import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';
import { createLab } from '@/services/labRoomService';
import { RoomResponseDto } from '@/types/labRoom';
import { Snippet } from '@heroui/snippet';

export default function App() {
  const [roomResponse, setRoomResponse] =
    React.useState<RoomResponseDto | null>(null);

  return (
    <DefaultLayout>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='inline-block max-w-lg text-center justify-center'>
          {!roomResponse ? (
            <div>
              <h1 className={title()}>Create your new lab</h1>
              <Form
                className='w-full max-w-100 flex flex-col gap-4 mt-16'
                onSubmit={async (e) => {
                  e.preventDefault();
                  let data = Object.fromEntries(new FormData(e.currentTarget));
                  const Labname = data.Labname as string;
                  const email = data.email as string;
                  const adminpin = data.adminpin as string;

                  try {
                    var res = await createLab({
                      labName: Labname,
                      password: email,
                      adminPin: adminpin,
                    });
                    setRoomResponse(res);
                  } catch (error) {
                    return;
                  }
                }}>
                <Input
                  errorMessage='Please enter lab name'
                  label='Labname'
                  labelPlacement='outside'
                  name='Labname'
                  placeholder='Enter lab name'
                  type='text'
                />
                <Input
                  label='Password'
                  labelPlacement='outside'
                  minLength={4}
                  name='email'
                  placeholder='Enter your password'
                  type='password'
                />
                <div className='flex flex-col items-start gap-2'>
                  <div className='text-small'>Admin PIN</div>
                  <InputOtp
                    length={4}
                    name='adminpin'
                    variant='faded'
                    type='password'
                  />
                </div>
                <Button color='primary' type='submit'>
                  Submit
                </Button>
              </Form>
            </div>
          ) : (
            <div>
              <h1 className={title()}>Urls are ready</h1>
              <div className='w-full gap-4 mt-16'>
                <span className=''>Members URL: </span>
                <Snippet color='primary' variant='bordered'>
                  {roomResponse.membersUrl}
                </Snippet>
              </div>
              <div className='w-full gap-4 mt-16'>
                <span className=''>Admin URL:</span>
                <Snippet color={'warning'} variant='bordered'>
                  {roomResponse.adminUrl}
                </Snippet>
              </div>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
