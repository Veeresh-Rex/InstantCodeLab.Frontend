import React, { useCallback, useMemo } from 'react';
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
  handleChangeUser: (selectedUserIds: Set<string>) => void;
  currentUser: User;
  selectedKeys: Set<string>;
}

const baseColumns = [
  { name: 'MEMBERS', uid: 'name' },
  { name: 'ACTIONS', uid: 'actions' },
];

const ActiveMembers: React.FC<ActiveMembersProps> = ({
  users,
  handleChangeUser,
  currentUser,
  selectedKeys,
}) => {

  const [memberCount, setMemberCount] = React.useState<number>(users.length);

  React.useEffect(() => {
    setMemberCount(users.length);
  }, [users.length]);

  const visibleColumns = useMemo(() => {
    return currentUser?.isAdmin
      ? baseColumns
      : baseColumns.filter((col) => col.uid !== 'actions');
  }, [currentUser?.isAdmin]);

  const onRemoveUser = useCallback(
    async (id: string) => {
      await invokeMethod('LeaveRoom', currentUser.joinedLabRoomId, id);
    },
    [currentUser.joinedLabRoomId]
  );
  
  // Render table cell content
  const renderCell = useCallback(
    (user: User, columnKey: string) => {
      switch (columnKey) {
        case 'name':
          return (
            <div>
              {user.username}{' '}
              {user.isAdmin && (
                <Chip color='danger' size='sm'>
                  Admin
                </Chip>
              )}{' '}
              {currentUser?.id === user.id && (
                <Chip color='primary' size='sm'>
                  You
                </Chip>
              )}
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
    [onRemoveUser, currentUser.id]
  );

  return (
    <Table
      removeWrapper
      aria-label='Active Members'
      className='h-40'
      selectedKeys={selectedKeys}
      selectionMode='single'
      // @ts-ignore because heroui might have a loose type for this prop
      onSelectionChange={handleChangeUser}
      disallowEmptySelection>
      <TableHeader columns={visibleColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
            {column.uid === 'name' && (
              <Chip
                className='text-xs font-semibold hover:cursor-pointer ml-2'
                color='danger'
                size='sm'
                variant='solid'>
                {memberCount}
              </Chip>
            )}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(user) => (
          <TableRow key={user.id}>
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
