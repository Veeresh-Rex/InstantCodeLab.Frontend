export interface User {
  id: string;
  username: string;
  code: string;
  joinedLabRoomId: string;
  joinedLabRoomName: string;
  language: string;
  isAdmin: boolean;
}

export interface LabLoginResponseDto {
  id: string;
  username: string;
  isAdmin: boolean;
  code: string;
  labRoomName: string;
}
