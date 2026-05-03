import { create } from 'zustand';
import type { PageName, ToastItem, User } from '../types';

interface AppStore {
  // Navigation
  activePage: PageName;
  setActivePage: (page: PageName) => void;

  // Auth system
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;

  // Toast system
  toasts: ToastItem[];
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: string) => void;

  // Confirm system
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Navigation
  activePage: 'visits',
  setActivePage: (page) => set({ activePage: page }),

  // Auth system
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: (() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  })(),
  login: (token, user) => {
    localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, token, user: user || null, activePage: 'visits' });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, token: null, user: null, activePage: 'login' });
  },

  // Toast system
  toasts: [],
  addToast: (message, type) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    
    // Auto-dismiss all toasts after 3s
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Confirm system
  confirmDialog: null,
  showConfirm: (title, message, onConfirm) => {
    set({ confirmDialog: { isOpen: true, title, message, onConfirm } });
  },
  hideConfirm: () => set({ confirmDialog: null }),
}));
