import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { Visit, CreateVisitPayload, VisitFilters, Stats } from '../types';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getVisits = async (filters?: VisitFilters): Promise<Visit[]> => {
  const params: Record<string, string | number> = {};
  if (filters?.clinicianId) params.clinicianId = filters.clinicianId;
  if (filters?.patientId) params.patientId = filters.patientId;
  const { data } = await api.get<ApiResponse<Visit[]>>(ENDPOINTS.VISITS, { params });
  return data.data;
};

export const createVisit = async (payload: CreateVisitPayload): Promise<Visit> => {
  const { data } = await api.post<ApiResponse<Visit>>(ENDPOINTS.CREATE_VISIT, payload);
  return data.data;
};

export const deleteVisit = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.DELETE_VISIT(id));
};

export const getStats = async (): Promise<Stats> => {
  const { data } = await api.get<ApiResponse<Stats>>(ENDPOINTS.STATS);
  return data.data;
};
