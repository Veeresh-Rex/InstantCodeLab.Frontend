import React, { useCallback, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { Chip } from '@heroui/chip';

import { User } from '@/types/userTypes';
import { invokeMethod } from '@/services/signalRService';

interface ActiveMembersProps {
  users: User[];
  handleChangeUser: (selectedUserIds: string) => void;
  currentUser: User;
}

const columns = [
  { name: 'MEMBERS', uid: 'name' },
  { name: 'ACTIONS', uid: 'actions' },
];

const ActiveMembers: React.FC<ActiveMembersProps> = ({
  users,
  handleChangeUser,
  currentUser,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set([currentUser.id])
  );

  const onRemoveUser = async (id: string) => {
    await invokeMethod('LeaveRoom', currentUser.joinedLabRoomId, id);
  };

  if (!currentUser?.isAdmin) {
    columns.splice(1, 1);
  }

  const renderCell = useCallback(
    (user: User, columnKey: string) => {
      switch (columnKey) {
        case 'name':
          return (
            <div>
              {user.username}
              {'  '}
              {user.isAdmin ? (
                <Chip color='danger' size='sm'>
                  Admin
                </Chip>
              ) : null}
              {'  '}
              {currentUser?.id === user.id ? (
                <Chip color='primary' size='sm'>
                  You
                </Chip>
              ) : null}
            </div>
          );
        case 'actions':
          return (
            <div className='relative flex items-center justify-center gap-2'>
              <button
                aria-label='Remove user'
                className='text-lg text-danger cursor-pointer active:opacity-50'
                onClick={() => onRemoveUser(user.id)}>
                <Trash2 />
              </button>
            </div>
          );
        default:
          return null;
      }
    },
    [onRemoveUser]
  );

  const handleSelectedUser = useCallback(
    (activeUserSet: Set<string>) => {
      setSelectedKeys(activeUserSet);
      handleChangeUser(Array.from(activeUserSet)[0] || '');
    },
    [handleChangeUser]
  );

  return (
    <Table
      removeWrapper
      aria-label='Active Members'
      className='h-40'
      selectedKeys={selectedKeys}
      selectionMode='single'
      // @ts-ignore
      onSelectionChange={handleSelectedUser}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(user) => (
          <TableRow key={user?.id}>
            {(columnKey) => (
              <TableCell>{renderCell(user, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ActiveMembers;
