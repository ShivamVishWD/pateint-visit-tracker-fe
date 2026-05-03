import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { LoginPayload, AuthResponse } from '../types';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, payload);
  return data.data;
};