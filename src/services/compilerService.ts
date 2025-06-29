import apiClient from '@/services/apiClient';
import { CompileRequestDto, CompileResponseDto } from '@/types/compiler';

export const compileTheCode = async (
  body: CompileRequestDto
): Promise<CompileResponseDto> => {
  try {
    const response = await apiClient.post('/api/Compiler', body);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
