"use client";
import { CheckCircle2, Clock3 } from "lucide-react";
import { TaskStatus } from "@/lib/types";

type StatusToggleProps = {
  status: TaskStatus;
  disabled?: boolean;
  onToggle: () => void;
  labelPosition?: "left" | "right";
};

export function StatusToggle({
  status,
  disabled = false,
  onToggle,
  labelPosition = "left",
}: StatusToggleProps) {
  const isCompleted = status === "COMPLETED";

  return (
    <div className="flex items-center gap-3">
      {/* Label – only show the CURRENT state */}
      {labelPosition === "left" && (
        <div className="min-w-[80px] text-right">
          {isCompleted ? (
            <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} />
              Done
            </span>
          ) : (
            <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-amber-700">
              <Clock3 size={14} />
              Pending
            </span>
          )}
        </div>
      )}

      {/* The toggle switch – icon only inside */}
      <button
        type="button"
        role="switch"
        aria-checked={isCompleted}
        aria-label={`Toggle task status: currently ${isCompleted ? "completed" : "pending"}`}
        onClick={onToggle}
        disabled={disabled}
        className={`
          group relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center 
          rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
          disabled:cursor-not-allowed disabled:opacity-50
          ${isCompleted ? "bg-emerald-600" : "bg-amber-500"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-7 w-7 transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${isCompleted ? "translate-x-8" : "translate-x-0.5"}
          `}
        >
          <span className="absolute inset-0 flex items-center justify-center text-lg">
            {isCompleted ? (
              <CheckCircle2 size={18} className="text-emerald-700" />
            ) : (
              <Clock3 size={18} className="text-amber-700" />
            )}
          </span>
        </span>
      </button>

      {/* Right-side label – only current state */}
      {labelPosition === "right" && (
        <div className="min-w-[80px]">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} />
              Done
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
              <Clock3 size={14} />
              Pending
            </span>
          )}
        </div>
      )}
    </div>
  );
}
