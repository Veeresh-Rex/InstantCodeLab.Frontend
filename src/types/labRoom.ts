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
}