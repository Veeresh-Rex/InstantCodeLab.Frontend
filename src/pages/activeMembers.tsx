import React, { useCallback, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User as UserComponent,
} from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { User } from '@/types/User';

interface ActiveMember {
  id: string;
  userName: string;
}

interface ActiveMembersProps {
  users: User[];
  handleChangeUser: (selectedUserIds: string) => void;
  defaultSelected: string;
  onRemoveUser?: (userId: string) => void;
}

const columns = [
  { name: 'MEMBERS', uid: 'name' },
  { name: 'ACTIONS', uid: 'actions' },
] as const;

const ActiveMembers: React.FC<ActiveMembersProps> = ({
  users,
  handleChangeUser,
  defaultSelected,
  onRemoveUser,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set([defaultSelected])
  );

  const renderCell = useCallback(
    (user: ActiveMember, columnKey: string) => {
      switch (columnKey) {
        case 'name':
          return (
            <UserComponent avatarProps={{ radius: 'lg' }} name={user.userName} />
          );
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <button
                onClick={() => onRemoveUser?.(user.id)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
                aria-label="Remove user"
              >
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
      aria-label="Active Members"
      selectionMode="single"
      removeWrapper
      className="h-40"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectedUser}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(user) => (
          <TableRow key={user.id}>
            {(columnKey) => (
              <TableCell>{renderCell(user, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ActiveMembers;
