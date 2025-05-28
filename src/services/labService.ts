import { LabLoginResponseDto } from '@/types/user';
import apiClient from './apiClient';

export const userLoginLab = async (body: any, labId: string | undefined): Promise<LabLoginResponseDto> => {
  try {
    const response = await apiClient.post(`/api/User/${labId}`, body);
    return response.data;
  } catch (error: any) {
    console.error('Error creating lab:', error);
    throw error;
  }
};
