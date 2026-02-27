"use client";

import { Funnel, Plus, Search, X } from "lucide-react";
import { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/classnames";

type TasksToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: "ALL" | TaskStatus;
  onStatusChange: (status: "ALL" | TaskStatus) => void;
  onCreateClick: () => void;
};

const TABS: Array<"ALL" | TaskStatus> = ["ALL", "PENDING", "COMPLETED"];

export function TasksToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreateClick,
}: TasksToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input Group */}
        <div className="relative w-full sm:max-w-md">
          <label htmlFor="task-search" className="sr-only">
            Search tasks
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            id="task-search"
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-600/10"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Add Task
        </button>
      </div>

      {/* Filter Section */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Funnel size={14} />
          <span>Filter Status:</span>
        </div>

        <div className="flex gap-1.5">
          {TABS.map((tab) => {
            const isActive = status === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onStatusChange(tab)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-teal-500 outline-none",
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
