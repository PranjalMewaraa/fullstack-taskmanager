"use client";

import { CalendarDays, PencilLine, Trash2 } from "lucide-react";
import { Task } from "@/lib/types";
import { StatusToggle } from "./status-toggle";

type TaskCardProps = {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isBusy: boolean;
};

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  isBusy,
}: TaskCardProps) {
  const dateFormatted = new Date(task.createdAt).toLocaleDateString();

  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        isBusy ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Header: Title & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold leading-tight text-slate-900 line-clamp-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Quick Management Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Task"
          >
            <PencilLine size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-row-reverse items-center justify-between">
        <StatusToggle
          status={task.status}
          onToggle={() => onToggle(task.id)}
          disabled={isBusy}
        />

        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <CalendarDays size={14} />
          <time dateTime={task.createdAt}>{dateFormatted}</time>
        </div>
      </div>
    </article>
  );
}
