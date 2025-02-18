import { create } from 'zustand';
import { User } from '../types';

interface AppState {
  user: User | null;
  language: string;
  isOffline: boolean;
  setUser: (user: User | null) => void;
  setLanguage: (lang: string) => void;
  setIsOffline: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  language: 'en',
  isOffline: false,
  setUser: (user) => set({ user }),
  setLanguage: (language) => set({ language }),
  setIsOffline: (isOffline) => set({ isOffline }),
}));