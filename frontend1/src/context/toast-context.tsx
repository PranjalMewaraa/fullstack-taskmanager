'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/classnames';

type ToastKind = 'success' | 'error';

type Toast = {
  id: string;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const createToastId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string, kind: ToastKind) => {
    const id = createToastId();
    setToasts((prev) => [...prev, { id, message, kind }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(
    () => ({
      success: (message: string) => pushToast(message, 'success'),
      error: (message: string) => pushToast(message, 'error'),
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'rounded-xl border p-3 text-sm shadow-card backdrop-blur-sm transition-all',
              toast.kind === 'success'
                ? 'border-teal-500/40 bg-teal-500/15 text-teal-900'
                : 'border-red-400/50 bg-red-500/15 text-red-900',
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
};
