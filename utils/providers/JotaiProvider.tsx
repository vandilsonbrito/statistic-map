'use client'
import { ReactNode } from 'react';
import { Provider } from 'jotai';

interface JotaiProviderProp {
    children: ReactNode;
}

export const JotaiProvider: React.FC<JotaiProviderProp> = ({ children }) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}