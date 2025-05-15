import apiClient from './apiClient';

export const userLoginLab = async (body: any): Promise<any> => {
  try {
    const response = await apiClient.post('/api/User/CodeLab', body);
    return response.data;
  } catch (error: any) {
    console.error('Error creating lab:', error);
    throw error;
  }
};
