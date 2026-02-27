'use client';

import { Task } from '@/lib/types';

type TaskCardProps = {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isBusy: boolean;
};

export function TaskCard({ task, onToggle, onEdit, onDelete, isBusy }: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-slate-300 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{task.title}</h3>
          {task.description ? <p className="mt-1 text-sm text-slate-600">{task.description}</p> : null}
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-bold ${
            task.status === 'COMPLETED' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {task.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onToggle(task.id)}
          disabled={isBusy}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-500"
        >
          Toggle
        </button>
        <button
          onClick={() => onEdit(task)}
          disabled={isBusy}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          disabled={isBusy}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-500"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
