import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApiService } from '../../services/api/shared/authApi';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  login: (username: string, password: string, totpCode: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null,

      // Synchronous Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Async Actions
      login: async (username: string, password: string, totpCode: string) => {
        try {
          set({ loading: true, error: null });
          const result = await authApiService.login(username, password, totpCode);
          
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          set({ error: 'Login failed. Please check your credentials.', loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          await authApiService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
          });
        }
      },

      refreshToken: async () => {
        try {
          const token = get().token;
          if (!token) return;

          const result = await authApiService.refreshToken();
          set({ token: result.token });
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ loading: true, error: null });
          await authApiService.changePassword(currentPassword, newPassword);
          set({ loading: false });
        } catch (error) {
          set({ error: 'Failed to change password', loading: false });
          throw error;
        }
      },

      initializeAuth: () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token and get user info
          set({ token, isAuthenticated: true });
          // In a real app, you would verify the token with the backend
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      })
    }
  )
);
