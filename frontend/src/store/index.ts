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
      language: "en", // Always default to English
      isOffline: false,
      setUser: (user) => set({ user }),
      setLanguage: (lang) => {
        // Update both store and localStorage
        set({ language: lang });
        localStorage.setItem("app_language", lang);
      },
      setIsOffline: (isOffline) => set({ isOffline }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        user: state.user,
        // Do not persist language state
      }),
    }
  )
);
