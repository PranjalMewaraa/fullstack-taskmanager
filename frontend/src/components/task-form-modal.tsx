'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { taskCreateSchema, taskUpdateSchema } from '@/lib/validation';

type TaskFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialTask?: Task | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description?: string }) => Promise<void>;
};

export function TaskFormModal({
  open,
  mode,
  initialTask,
  isSaving,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTitle(initialTask?.title || '');
    setDescription(initialTask?.description || '');
    setError(null);
  }, [initialTask, open]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const schema = mode === 'create' ? taskCreateSchema : taskUpdateSchema;
    const parsed = schema.safeParse({
      title,
      description: description.trim() ? description.trim() : undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid task data');
      return;
    }

    try {
      await onSubmit(parsed.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Request failed');
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-300 bg-white p-5 shadow-card">
        <h3 className="text-lg font-bold text-ink">{mode === 'create' ? 'Add task' : 'Edit task'}</h3>
        <p className="mt-1 text-sm text-slate-600">Keep tasks short and action-focused.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            className="h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
