'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi, setAccessToken, setUnauthorizedHandler } from '@/lib/api';
import { User } from '@/lib/types';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readApiErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || 'Something went wrong';
  }

  return 'Something went wrong';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const forceLogout = useCallback(() => {
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    setUnauthorizedHandler(forceLogout);
    return () => setUnauthorizedHandler(null);
  }, [forceLogout]);

  const applyAuth = useCallback((token: string, nextUser: User) => {
    setAccessToken(token);
    setAccessTokenState(token);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login({ email, password });
      applyAuth(response.data.data.accessToken, response.data.data.user);
      router.push('/dashboard');
    },
    [applyAuth, router],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await authApi.register({ email, password });
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      forceLogout();
    }
  }, [forceLogout]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await authApi.refresh();
        applyAuth(response.data.data.accessToken, response.data.data.user);
      } catch {
        setAccessToken(null);
        setAccessTokenState(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [applyAuth]);

  const value = useMemo(
    () => ({
      user,
      accessToken: accessTokenState,
      isLoading,
      isAuthenticated: Boolean(user && accessTokenState),
      login: async (email: string, password: string) => {
        try {
          await login(email, password);
        } catch (error) {
          throw new Error(readApiErrorMessage(error));
        }
      },
      register: async (email: string, password: string) => {
        try {
          await register(email, password);
        } catch (error) {
          throw new Error(readApiErrorMessage(error));
        }
      },
      logout,
    }),
    [accessTokenState, isLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
