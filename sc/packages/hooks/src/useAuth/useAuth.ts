import { createContext, useContext, useCallback } from 'react';

export interface AuthContextValue {
  /** 当前用户拥有的权限标识列表 */
  permissions: string[];
}

export const AuthContext = createContext<AuthContextValue>({
  permissions: [],
});

/**
 * 检查当前用户是否拥有指定权限
 * 需配合 AuthProvider 使用
 */
export function useAuth(authCode?: string): boolean {
  const { permissions } = useContext(AuthContext);

  if (!authCode) return true;

  return permissions.includes(authCode);
}
