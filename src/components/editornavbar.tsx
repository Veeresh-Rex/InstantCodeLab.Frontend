import { Navbar, NavbarContent, NavbarItem, NavbarBrand } from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from '@heroui/dropdown';
import { Link } from '@heroui/link';
import { Download, Play, LogOut, Trash2 } from 'lucide-react';
import { Chip } from '@heroui/chip';
import React from 'react';

import { ThemeSwitch } from '@/components/theme-switch';
import { stopConnection } from '@/services/signalRService';
import { getUserInfo } from '@/services/userService';
import { languages } from '@/constant/constant';

export const EditorNavbar = ({
  userName,
  chatRoom,
}: {
  userName: string;
  chatRoom: string;
}) => {
  const getUser = getUserInfo();

  const [selectedKey, setSelectedKey] = React.useState<string>(
    languages[0].key
  );

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
                  {languages.find((e) => e.key === selectedKey)?.label}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Single selection example'
                items={languages}
                selectedKeys={selectedKey}
                selectionMode='single'
                variant='flat'
                onSelectionChange={(keys) => {
                  setSelectedKey(keys as string);
                }}>
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
              Javascript
            </Chip>
          )}
        </NavbarItem>
      </NavbarBrand>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem>
          <Button isIconOnly as={Link} color='primary' href='#' variant='flat'>
            <Play />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button isIconOnly as={Link} color='success' href='#' variant='flat'>
            <Download />
          </Button>
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
          <DropdownMenu aria-label='Profile Actions' variant='flat'>
            <DropdownItem key='profile' className='h-14 gap-2'>
              <p className='font-semibold'>Signed in as</p>
              <p className='font-semibold'>{userName}</p>
            </DropdownItem>
            <DropdownItem
              key='deleteroom'
              as={Link}
              className={'text-danger'}
              color='danger'
              href='/'
              startContent={<Trash2 />}
              onClick={stopConnection}>
              Delete Room
            </DropdownItem>
            <DropdownItem
              key='logout'
              as={Link}
              className={'text-danger'}
              color='danger'
              href='/'
              startContent={<LogOut />}
              onClick={stopConnection}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
