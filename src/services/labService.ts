import { User } from '@/types/userTypes';
import apiClient from './apiClient';

export const userLoginLab = async (body: any, labId: string | undefined): Promise<User> => {
  try {
    const response = await apiClient.post<User>(`/api/User/${labId}`, body);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
