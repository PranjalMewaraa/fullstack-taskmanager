'use client';

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-sm">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
