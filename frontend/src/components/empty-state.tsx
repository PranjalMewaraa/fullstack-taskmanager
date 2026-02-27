'use client';

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-400 bg-white/70 p-8 text-center">
      <h3 className="text-lg font-bold text-ink">No tasks found</h3>
      <p className="mt-2 text-sm text-slate-600">Try changing filters or create your first task.</p>
    </div>
  );
}
