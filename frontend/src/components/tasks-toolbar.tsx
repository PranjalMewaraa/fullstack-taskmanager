'use client';

import { TaskStatus } from '@/lib/types';
import { cn } from '@/lib/classnames';

type TasksToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: 'ALL' | TaskStatus;
  onStatusChange: (status: 'ALL' | TaskStatus) => void;
  onCreateClick: () => void;
};

const tabs: Array<'ALL' | TaskStatus> = ['ALL', 'PENDING', 'COMPLETED'];

export function TasksToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreateClick,
}: TasksToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white/80 p-4 shadow-card backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600"
            placeholder="Search tasks by title"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="rounded-xl bg-ember px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Add Task
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onStatusChange(tab)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition',
              status === tab
                ? 'border-ink bg-ink text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
