import apiClient from '@/services/apiClient';
import { RoomRequestDto, RoomResponseDto, GetRoomDto } from '@/types/labRoom';

export const createLab = async (
  body: RoomRequestDto
): Promise<RoomResponseDto> => {
  try {
    const response = await apiClient.post('/api/Room', body);
    return response.data;
  } catch (error: any) {
    console.error('Error creating lab:', error);
    throw error;
  }
};


export const getRoom = async(id: string): Promise<GetRoomDto> =>{
 try {
    const response = await apiClient.get<GetRoomDto>(`/api/Room/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}