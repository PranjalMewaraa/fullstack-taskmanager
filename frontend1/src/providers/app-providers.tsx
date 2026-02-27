'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/context/toast-context';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
