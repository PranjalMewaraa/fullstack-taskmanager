'use client';

import { ClipboardList } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-400 bg-white/75 p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        <ClipboardList size={22} />
      </div>
      <h3 className="text-lg font-bold text-ink">No tasks found</h3>
      <p className="mt-2 text-sm text-slate-600">Try changing filters or create your first task.</p>
    </div>
  );
}
