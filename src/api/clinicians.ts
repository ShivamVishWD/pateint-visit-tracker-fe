import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { Clinician, CreateClinicianPayload } from '../types';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getClinicians = async (): Promise<Clinician[]> => {
  const { data } = await api.get<ApiResponse<Clinician[]>>(ENDPOINTS.CLINICIANS);
  return data.data;
};

export const createClinician = async (payload: CreateClinicianPayload): Promise<Clinician> => {
  const { data } = await api.post<ApiResponse<Clinician>>(ENDPOINTS.CREATE_CLINICIAN, payload);
  return data.data;
};

export const deleteClinician = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.DELETE_CLINICIAN(id));
};
