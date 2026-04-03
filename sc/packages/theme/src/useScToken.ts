import { useContext } from 'react';
import { ScTokenContext } from './ScConfigProvider';
import type { ScToken } from './token';

export function useScToken(): ScToken {
  const token = useContext(ScTokenContext);
  if (!token) {
    throw new Error('useScToken must be used within a ScConfigProvider');
  }
  return token;
}
