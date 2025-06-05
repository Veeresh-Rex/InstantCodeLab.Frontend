import { User } from '@/types/user';
import apiClient from './apiClient';

export const userLoginLab = async (body: any, labId: string | undefined): Promise<User> => {
  try {
    const response = await apiClient.post<User>(`/api/User/${labId}`, body);
    return response.data;
  } catch (error: any) {
    console.error('Error creating lab:', error);
    throw error;
  }
};
