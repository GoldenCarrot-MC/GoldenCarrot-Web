import { create } from 'zustand';
import { authService } from '../services/auth';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  discordId?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, token: string) => void;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Listen for unauthorized events from interceptor
  window.addEventListener('auth-unauthorized', () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  });

  return {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: true,

    setAuth: (user, token) => {
      localStorage.setItem('accessToken', token);
      set({ user, accessToken: token, isAuthenticated: true });
    },

    login: async (data) => {
      const response = await authService.login(data);
      const { user, accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      set({ user, accessToken, isAuthenticated: true });
    },

    logout: async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error', error);
      } finally {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      }
    },

    checkAuth: async () => {
      set({ isLoading: true });
      try {
        const response = await authService.getMe();
        set({ user: response.data.user, isAuthenticated: true });
      } catch (error) {
        // Interceptor will handle refresh if access token expired
        // If refresh fails, it clears localStorage and triggers 'auth-unauthorized'
        set({ user: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    }
  };
});

// Add event listener for cross-tab synchronization
window.addEventListener('storage', (e) => {
  if (e.key === 'accessToken') {
    if (e.newValue) {
      useAuthStore.setState({ accessToken: e.newValue });
      // If the tab was not authenticated, fetch the user data
      if (!useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().checkAuth();
      }
    } else {
      useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
    }
  }
});
