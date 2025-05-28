import { UserType } from '@/constant/enums';

export interface User {
  id: string;
  username: string;
  code: string;
  joinedLabRoomId: string;
  joinedLabRoomName: string;
  language: string;
  userType: UserType;
}

export interface LabLoginResponseDto {
  id: string;
  username: string;
  isAdmin: boolean;
  code: string;
  labRoomName: string;
}
