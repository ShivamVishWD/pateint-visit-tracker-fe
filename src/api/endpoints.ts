export const ENDPOINTS = {
  CLINICIANS: '/clinicians',
  CREATE_CLINICIAN: '/clinician',
  DELETE_CLINICIAN: (id: number) => `/clinician/${id}`,
  PATIENTS: '/patients',
  CREATE_PATIENT: '/patient',
  DELETE_PATIENT: (id: number) => `/patient/${id}`,
  VISITS: '/visits',
  CREATE_VISIT: '/visit',
  DELETE_VISIT: (id: number) => `/visit/${id}`,
  STATS: '/stats',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
};

