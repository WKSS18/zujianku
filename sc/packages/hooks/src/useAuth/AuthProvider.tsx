import React from 'react';
import { AuthContext } from './useAuth';
import type { AuthContextValue } from './useAuth';

export interface AuthProviderProps extends AuthContextValue {
  children: React.ReactNode;
}

export function AuthProvider({ permissions, children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ permissions }}>
      {children}
    </AuthContext.Provider>
  );
}
