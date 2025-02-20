import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface AppState {
  user: User | null;
  language: string;
  isOffline: boolean;
  setUser: (user: User | null) => void;
  setLanguage: (lang: string) => void;
  setIsOffline: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: "en",
      isOffline: false,
      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      setIsOffline: (isOffline) => set({ isOffline }),
    }),
    {
      name: "app-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        language: state.language,
      }), // only persist these fields
    }
  )
);
