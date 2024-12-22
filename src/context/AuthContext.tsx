import React, { createContext, useContext, useState } from 'react';
import { User, AuthState, TradingAccount } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    const defaultAccount: TradingAccount = {
      id: '1',
      name: 'Main Trading Account',
      balance: 10000,
      currency: 'USD',
    };

    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
      phoneNumber: '',
      joinedDate: new Date().toISOString(),
      accounts: [defaultAccount],
      selectedAccountId: defaultAccount.id,
    };
    setAuthState({ user: mockUser, isAuthenticated: true });
  };

  const register = async (email: string, password: string, name: string) => {
    // In a real app, this would make an API call
    const defaultAccount: TradingAccount = {
      id: '1',
      name: 'Main Trading Account',
      balance: 10000,
      currency: 'USD',
    };

    const mockUser: User = {
      id: '1',
      email,
      name,
      phoneNumber: '',
      joinedDate: new Date().toISOString(),
      accounts: [defaultAccount],
      selectedAccountId: defaultAccount.id,
    };
    setAuthState({ user: mockUser, isAuthenticated: true });
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateUser = async (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState({ ...authState, user: updatedUser });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};