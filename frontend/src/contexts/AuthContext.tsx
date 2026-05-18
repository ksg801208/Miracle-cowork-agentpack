import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '../types';

const TOKEN_KEY = 'miracle_token';
const USER_KEY = 'miracle_user';

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (token && userRaw) {
      try {
        return { token, user: JSON.parse(userRaw) };
      } catch {
        // 파싱 실패 시 초기화
      }
    }
    return { token: null, user: null };
  });

  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ token, user });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAuthenticated: !!state.token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
