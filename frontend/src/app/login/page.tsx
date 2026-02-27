'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="min-h-screen bg-auth-pattern px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-300 bg-white/95 p-6 shadow-card">
        <h1 className="text-2xl font-black text-ink">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-600">Login to continue managing your tasks.</p>

        <div className="mt-5">
          <AuthForm
            mode="login"
            isSubmitting={isSubmitting}
            onSubmit={async (email, password) => {
              setIsSubmitting(true);
              try {
                await login(email, password);
                toast.success('Login successful');
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        </div>

        <p className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link href="/register" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
