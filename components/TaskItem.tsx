"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { TaskEntry } from "@/lib/types";

const checkboxHover =
  "transition-shadow hover:shadow-[0_0_15px_rgba(230,230,250,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50";

type TaskItemProps = {
  task: TaskEntry;
  editMode: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCommit: (value: string) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
};

function TaskCheckbox({
  completed,
  onToggle,
}: {
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={completed ? "Mark task incomplete" : "Mark task complete"}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-slate-500/55 bg-transparent ${checkboxHover} ${
        completed ? "border-slate-400/70 bg-slate-500/25" : ""
      }`}
    >
      {completed ? (
        <span className="block h-2 w-2 rounded-[1px] bg-slate-300/75" aria-hidden />
      ) : null}
    </button>
  );
}

export function TaskItem({
  task,
  editMode,
  isEditing,
  onStartEdit,
  onCommit,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { text, completed } = task;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const textTone = completed
    ? "text-white/45 line-through decoration-white/35"
    : "text-white/90";

  if (!editMode) {
    return (
      <li className="flex items-start gap-2.5 py-2.5">
        <span className="pt-0.5">
          <TaskCheckbox completed={completed} onToggle={onToggleComplete} />
        </span>
        <span
          className={`font-sans text-sm leading-snug ${textTone} transition-[opacity,color] duration-200`}
        >
          {text}
        </span>
      </li>
    );
  }

  if (isEditing) {
    return (
      <li className="flex items-center gap-2 py-2">
        <TaskCheckbox completed={completed} onToggle={onToggleComplete} />
        <input
          ref={inputRef}
          type="text"
          defaultValue={text}
          className="flex-1 rounded-md border border-slate-500/35 bg-white/[0.07] px-2 py-1.5 font-sans text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
          aria-label="Edit task"
          onBlur={(e) => onCommit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              onCommit(text);
            }
          }}
        />
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded p-1 text-red-400 transition-all hover:text-red-300 hover:drop-shadow-[0_0_10px_rgba(248,113,113,0.85)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          aria-label="Delete task"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-2 py-2">
      <TaskCheckbox completed={completed} onToggle={onToggleComplete} />
      <button
        type="button"
        onClick={onStartEdit}
        className={`flex-1 rounded px-1 py-0.5 text-left font-sans text-sm transition-[opacity,color,background-color] duration-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 ${textTone}`}
      >
        {text}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded p-1 text-red-400 opacity-80 transition-all hover:opacity-100 hover:drop-shadow-[0_0_10px_rgba(248,113,113,0.85)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
        aria-label="Delete task"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </li>
  );
}
