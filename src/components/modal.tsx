import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { InputOtp } from '@heroui/input-otp';
import { Form } from '@heroui/form';
import { addToast } from '@heroui/toast';

import { userLoginLab } from '@/services/labService';
import { GetRoomDto } from '@/types/labRoom';
import { useParams } from 'react-router-dom';
import { User } from '@/types/userTypes';

interface ModalPartProps {
  roomDetails: GetRoomDto | null;
  setCurentUserData: (data: User) => void;
  isAdmin: boolean;
}

export default function ModalPart({
  roomDetails,
  setCurentUserData,
  isAdmin,
}: ModalPartProps) {
  const { isOpen, onClose, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });
  const { id } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      var response = await userLoginLab(
        {
          ...data,
          isAdmin,
        },
        id
      );

      setCurentUserData(response);
    } catch (error) {
      addToast({
        color: 'danger',
        variant: 'solid',
        title: 'Error from server',
        description: 'Failed to join lab. Please try again.',
      });

      return;
    }

    addToast({
      color: 'success',
      variant: 'solid',
      title: 'Success',
      description: 'You have successfully joined the lab.',
    });
    onClose();
  };

  return (
    <Modal
      backdrop='blur'
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Log in</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Input
              required
              label='Your Name'
              minLength={4}
              name='Username'
              placeholder='Enter Username'
              type='text'
            />
            {roomDetails?.isRoomPasswordEnabled && (
              <Input
                label='Lab Password'
                minLength={4}
                name='Password'
                placeholder='Enter lab password'
                type='password'
              />
            )}
            {isAdmin && roomDetails?.isAdminPinEnabled && (
              <div className='flex flex-col items-start gap-2'>
                <div className='text-small'>Admin PIN</div>
                <InputOtp
                  length={4}
                  name='AdminPIN'
                  type='password'
                  variant='faded'
                />
              </div>
            )}
            <Button className='mt-b' color='primary' type='submit'>
              Submit
            </Button>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
