import { Navbar, NavbarContent, NavbarItem, NavbarBrand } from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownSection,
} from '@heroui/dropdown';
import { Link } from '@heroui/link';
import { Download, Play, LogOut, Trash2, SquaresExclude } from 'lucide-react';
import { Chip } from '@heroui/chip';

import { ThemeSwitch } from '@/components/theme-switch';
import { invokeMethod, stopConnection } from '@/services/signalRService';
import { clearUserInfo, getUserInfo } from '@/services/userService';
import connection from '@/services/signalRClient';
import { addToast, SharedSelection, Spinner, User } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { LanguageCode } from '@/constant/enums';
import { Tooltip } from '@heroui/react';
import { useState } from 'react';

export const EditorNavbar = ({
  userName,
  chatRoom,
  handleCodeRunner,
  handleCodeDownload,
  languageCode,
}: {
  userName: string;
  chatRoom: string;
  handleCodeRunner?: () => void;
  handleCodeDownload?: () => void;
  languageCode: LanguageCode;
}) => {
  const getUser = getUserInfo();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const languages = Object.entries(LanguageCode).map(([label, key]) => ({
    key,
    label,
  }));

  const deleteRoom = async () => {
    try {
      if (connection) {
        await invokeMethod('DeleteRoom', getUser?.joinedLabRoomId);
        await stopConnection();
        addToast({
          title: 'Room deleted successfully',
          variant: 'solid',
          color: 'success',
        });
        navigate('/');
      }
    } catch (error) {
      addToast({
        title: 'Failed to delete room',
        variant: 'solid',
        color: 'danger',
      });
    }
  };

  const handleLanguageChange = (selectedKeys: SharedSelection) => {
    const selectedKey = Array.from(selectedKeys)[0];
    if (selectedKey) {
      invokeMethod('ChangeLanguage', selectedKey, getUser?.joinedLabRoomId);
    }
  };

  const logoutUser = async () => {
    await stopConnection();
    clearUserInfo();
    addToast({
      title: 'You left the room',
      variant: 'solid',
      color: 'success',
    });
    navigate('/');
  };

  const HandleOnClickOnCodeRunner = async () => {
    setIsLoading(true);
    if (handleCodeRunner) {
      try {
        await handleCodeRunner();
      } catch (error) {
        addToast({
          title: 'Unable to excute code',
          variant: 'solid',
          color: 'danger',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Navbar>
      <NavbarBrand className='mr-4'>
        <p className='hidden sm:block font-bold text-inherit text-lg'>
          {chatRoom}
        </p>
        <NavbarItem className='ml-2'>
          {getUser?.isAdmin ? (
            <Dropdown>
              <DropdownTrigger>
                <Button color='secondary' size='sm' variant='bordered'>
                  {languageCode.toUpperCase()}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Single selection example'
                items={languages}
                selectedKeys={new Set([languageCode])}
                selectionMode='single'
                variant='flat'
                onSelectionChange={handleLanguageChange}>
                {(item) => (
                  <DropdownItem key={item.key}>{item.label}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Chip
              className='text-xs font-semibold hover:cursor-pointer'
              color='secondary'
              size='sm'
              variant='bordered'>
              {languageCode.toUpperCase()}
            </Chip>
          )}
        </NavbarItem>
      </NavbarBrand>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem>
          <Tooltip content='Execute Code' delay={5000}>
            <Button
              isIconOnly
              as={Link}
              color='primary'
              href='#'
              onClick={HandleOnClickOnCodeRunner}
              variant='flat'>
              {isLoading ? <Spinner color='primary' /> : <Play />}
            </Button>
          </Tooltip>
        </NavbarItem>
        <NavbarItem>
          <Tooltip content='Download Code' delay={5000}>
            <Button
              isIconOnly
              color='success'
              onClick={handleCodeDownload}
              variant='flat'>
              <Download />
            </Button>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as='div' className='items-center' justify='end'>
        <NavbarItem className='hidden sm:flex gap-2'>
          <ThemeSwitch />
        </NavbarItem>
        <Dropdown placement='bottom-end'>
          <DropdownTrigger>
            <Avatar
              isBordered
              as='button'
              className='transition-transform'
              color='secondary'
              name={userName}
              size='sm'
            />
          </DropdownTrigger>

          <DropdownMenu aria-label='Profile Actions' variant='faded'>
            <DropdownItem
              key='profile'
              isReadOnly
              className='h-14 gap-2 opacity-100'>
              <User
                avatarProps={{
                  size: 'sm',
                }}
                classNames={{
                  name: 'text-default-600',
                  description: 'text-default-500',
                }}
                name={getUser?.username || 'Anonymous'}
              />
            </DropdownItem>
            <DropdownItem
              key='share-link'
              startContent={<SquaresExclude size={18} />}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/editor/${getUser?.joinedLabRoomId}`
                );
              }}>
              Copy Link
            </DropdownItem>
            <DropdownSection title='Danger zone'>
              {getUser?.isAdmin ? (
                <DropdownItem
                  key='deleteroom'
                  className={'text-danger'}
                  color='danger'
                  startContent={<Trash2 size={18} />}
                  onClick={deleteRoom}>
                  Delete Room
                </DropdownItem>
              ) : null}
              <DropdownItem
                key='logout'
                className={'text-danger'}
                color='danger'
                startContent={<LogOut size={18} />}
                onClick={logoutUser}>
                Logout
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
