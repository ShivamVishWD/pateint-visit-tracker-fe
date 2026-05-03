import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // We can't easily access the store here to call logout(), 
      // but App.tsx will re-render if we use a storage event listener or if we reload.
      // Better: App.tsx will check isAuthenticated on each render.
      window.location.href = '/'; // Or use a cleaner way if needed
    }
    return Promise.reject(error);
  }
);

export default api;

