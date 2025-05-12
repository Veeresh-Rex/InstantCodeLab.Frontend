import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import { useEffect } from 'react';
import { InputOtp } from '@heroui/input-otp';

export default function ModalPart() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

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
          <Input
            label='Username'
            placeholder='Enter your username'
            variant='bordered'
            type='text'
          />
          <Input
            label='Password'
            placeholder='Enter lab password'
            type='password'
            variant='bordered'
          />
          <div className='flex flex-col items-start gap-2'>
            <div className='text-xs font-thin'>Admin PIN</div>
            <InputOtp length={4} variant='bordered' type='password' />
          </div>
          <div className='flex py-2 px-1 justify-between'>
            <Checkbox
              classNames={{
                label: 'text-small',
              }}>
              Remember me
            </Checkbox>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onPress={onClose}>
            Action
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
