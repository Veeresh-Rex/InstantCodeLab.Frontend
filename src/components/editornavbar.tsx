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
import { Download, Play, LogOut } from 'lucide-react';
import { Chip } from '@heroui/chip';

import { ThemeSwitch } from '@/components/theme-switch';
import React from 'react';

export const EditorNavbar = ({ isAdmin = true }: { isAdmin?: boolean }) => {
  const languages = [
    {
      key: 'Javascript',
      label: 'Javascript',
    },
    {
      key: 'Csharp',
      label: 'C#',
    },
    {
      key: 'Python',
      label: 'Python',
    },
    {
      key: 'Java',
      label: 'Java',
    },
  ];

  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set([languages[0].key])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
    [selectedKeys]
  );

  return (
    <Navbar>
      <NavbarBrand className='mr-4'>
        <p className='hidden sm:block font-bold text-inherit text-lg'>
          LabName
        </p>
        <NavbarItem className='ml-2'>
          {isAdmin ? (
            <Dropdown>
              <DropdownTrigger>
                <Button color='secondary' variant='bordered' size='sm'>
                  {languages.find((e) => e.key === selectedValue)?.label}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Single selection example'
                items={languages}
                selectedKeys={selectedKeys}
                selectionMode='single'
                variant='flat'
                onSelectionChange={setSelectedKeys}>
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
              name='Username'
              size='sm'
            />
          </DropdownTrigger>
          <DropdownMenu aria-label='Profile Actions' variant='flat'>
            <DropdownItem key='profile' className='h-14 gap-2'>
              <p className='font-semibold'>Signed in as</p>
              <p className='font-semibold'>Username</p>
            </DropdownItem>
            <DropdownItem
              key='logout'
              href='/'
              as={Link}
              color='danger'
              className={'text-danger'}
              startContent={<LogOut />}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
