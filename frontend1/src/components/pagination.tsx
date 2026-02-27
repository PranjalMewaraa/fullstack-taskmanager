'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-sm shadow-sm">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={14} />
        Prev
      </button>
      <span className="font-semibold text-slate-700">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
