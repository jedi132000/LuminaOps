import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, user: User) => {
        console.log('🏪 Auth Store: Login called with token:', token?.substring(0, 20) + '...');
        console.log('🏪 Auth Store: User data:', user);
        set({ token, user, isAuthenticated: true });
        console.log('🏪 Auth Store: State updated successfully');
      },
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)