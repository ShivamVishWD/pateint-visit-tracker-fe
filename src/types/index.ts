// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Clinician {
  id: number;
  name: string;
  specialty: string;
  email: string;
}

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string; // ISO date string
  contactNumber: string;
  email: string;
}

export interface Visit {
  id: number;
  clinicianId: number;
  patientId: number;
  visitType: VisitType;
  visitedAt: string | null;  // ISO datetime or null
  notes: string | null;
  clinician: Clinician;
  patient: Patient;
}

export interface Stats {
  total_visits: number;
  total_clinicians: number;
  total_patients: number;
}

// ─── Enums / Constants ────────────────────────────────────────────────────────

export type VisitType =
  | 'General'
  | 'Follow-up'
  | 'Initial'
  | 'Urgent'
  | 'Routine'
  | 'Specialist'
  | 'Telehealth';

export const VISIT_TYPES: VisitType[] = [
  'General',
  'Follow-up',
  'Initial',
  'Urgent',
  'Routine',
  'Specialist',
  'Telehealth',
];

export const SPECIALTIES: string[] = [
  'Cardiology',
  'Neurology',
  'General Practice',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Oncology',
  'Psychiatry',
  'Radiology',
  'Emergency Medicine',
];

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface CreateVisitPayload {
  clinicianId: number;
  patientId: number;
  visitType: VisitType;
  visitedAt?: string;
  notes?: string;
}

export interface CreateClinicianPayload {
  name: string;
  specialty: string;
  email: string;
}

export interface CreatePatientPayload {
  name: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
}

export interface User {
  id?: number;
  email: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  name?: string;
  email?: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type PageName = 'visits' | 'clinicians' | 'patients' | 'login';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface VisitFilters {
  clinicianId?: number;
  patientId?: number;
}

