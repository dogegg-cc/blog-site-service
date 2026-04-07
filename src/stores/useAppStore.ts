import { create } from 'zustand'

interface AppState {
  theme: 'dark' | 'light'
  user: { name: string; avatar: string } | null
  setTheme: (theme: 'dark' | 'light') => void
  setUser: (user: { name: string; avatar: string } | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  user: null,
  setTheme: (theme) => set({ theme }),
  setUser: (user) => set({ user }),
}))
