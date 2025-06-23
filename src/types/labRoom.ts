import { LanguageCode } from "@/constant/enums";

export interface RoomRequestDto {
  labName: string;
  password: string | null;
  adminPin: string | null;
}

export interface RoomResponseDto {
  adminUrl: string | null;
  membersUrl: string | null;
}

export interface GetRoomDto{
  id: string
  labName : string,
  isRoomPasswordEnabled : boolean,
  isAdminPinEnabled : boolean,
  language: LanguageCode
}
