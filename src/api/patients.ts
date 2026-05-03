import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { Patient, CreatePatientPayload } from '../types';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getPatients = async (): Promise<Patient[]> => {
  const { data } = await api.get<ApiResponse<Patient[]>>(ENDPOINTS.PATIENTS);
  return data.data;
};

export const createPatient = async (payload: CreatePatientPayload): Promise<Patient> => {
  const { data } = await api.post<ApiResponse<Patient>>(ENDPOINTS.CREATE_PATIENT, payload);
  return data.data;
};

export const deletePatient = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.DELETE_PATIENT(id));
};
