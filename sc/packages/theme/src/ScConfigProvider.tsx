import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import { defaultScToken } from './token';
import type { ScToken } from './token';

export const ScTokenContext = createContext<ScToken | null>(null);

export interface ScConfigProviderProps {
  children: ReactNode;
  theme?: ThemeConfig;
  scToken?: Partial<ScToken>;
}

export function ScConfigProvider({ children, theme, scToken }: ScConfigProviderProps) {
  const mergedScToken = useMemo(
    () => ({ ...defaultScToken, ...scToken }),
    [scToken],
  );

  return (
    <ConfigProvider theme={theme}>
      <ScTokenContext.Provider value={mergedScToken}>
        {children}
      </ScTokenContext.Provider>
    </ConfigProvider>
  );
}
