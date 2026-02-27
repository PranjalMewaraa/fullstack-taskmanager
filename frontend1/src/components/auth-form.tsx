'use client';

import { FormEvent, useState } from 'react';
import { authSchema } from '@/lib/validation';

type AuthFormProps = {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
};

export function AuthForm({ mode, onSubmit, isSubmitting }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = authSchema.safeParse({ email, password });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input');
      return;
    }

    try {
      await onSubmit(parsed.data.email, parsed.data.password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Request failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Email</label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Password</label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder="At least 8 characters"
        />
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}
