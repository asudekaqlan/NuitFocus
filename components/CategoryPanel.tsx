"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { getPanelTheme } from "@/lib/panel-themes";
import { PanelIcon } from "@/lib/panel-icons";
import { SANCTUARY_SHELL, SANCTUARY_PAD_X } from "@/lib/sanctuary-styles";
import type { Panel } from "@/lib/types";
import { TaskItem } from "./TaskItem";

type CategoryPanelProps = {
  panel: Panel;
  onUpdateTitle: (id: string, title: string) => void;
  onDeletePanel: (id: string) => void;
  onUpdateTask: (panelId: string, taskIndex: number, text: string) => void;
  onDeleteTask: (panelId: string, taskIndex: number) => void;
  onAddTask: (panelId: string, text: string) => void;
  onToggleTaskComplete: (panelId: string, taskIndex: number) => void;
};

export function CategoryPanel({
  panel,
  onUpdateTitle,
  onDeletePanel,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onToggleTaskComplete,
}: CategoryPanelProps) {
  const [editMode, setEditMode] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState("");
  const theme = getPanelTheme(panel.color);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col overflow-hidden ${SANCTUARY_SHELL}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${theme.tint}`}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div
          className={`relative flex min-h-[3.5rem] items-center ${SANCTUARY_PAD_X} py-3 ${theme.headerBar}`}
        >
          {editMode && (
            <button
              type="button"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  window.confirm(`Delete “${panel.title}” and all its tasks?`)
                ) {
                  onDeletePanel(panel.id);
                }
              }}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 shrink-0 rounded-lg p-2 text-slate-300/80 transition-all hover:text-red-300 hover:shadow-[0_0_12px_rgba(252,165,165,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 sm:right-3"
              aria-label="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <div
            className={`flex min-w-0 flex-1 items-center gap-3 ${editMode ? "pr-11 sm:pr-12" : ""}`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-shadow hover:shadow-[0_0_15px_rgba(230,230,250,0.5)] ${theme.iconBg}`}
            >
              <PanelIcon name={panel.icon} className="h-4 w-4" />
            </span>
            {editMode ? (
              <input
                type="text"
                value={panel.title}
                onChange={(e) => onUpdateTitle(panel.id, e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-slate-500/35 bg-slate-950/40 px-2 py-1.5 text-left font-serif text-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                aria-label="Category title"
              />
            ) : (
              <h2 className="min-w-0 flex-1 text-left font-serif text-lg font-medium tracking-tight text-white">
                {panel.title}
              </h2>
            )}
          </div>
        </div>

        <div className={`flex-1 ${SANCTUARY_PAD_X} pb-4 pt-2`}>
          <AnimatePresence mode="popLayout">
            <motion.ul
              key={editMode ? "edit" : "view"}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.2 }}
              className="min-h-[120px]"
            >
              {panel.tasks.map((task, index) => (
                <TaskItem
                  key={`${panel.id}-${index}-${task.text.slice(0, 12)}`}
                  task={task}
                  editMode={editMode}
                  isEditing={editingTaskIndex === index}
                  onStartEdit={() => setEditingTaskIndex(index)}
                  onCommit={(value) => {
                    setEditingTaskIndex(null);
                    const trimmed = value.trim();
                    if (trimmed) onUpdateTask(panel.id, index, trimmed);
                    else onDeleteTask(panel.id, index);
                  }}
                  onDelete={() => {
                    setEditingTaskIndex(null);
                    onDeleteTask(panel.id, index);
                  }}
                  onToggleComplete={() =>
                    onToggleTaskComplete(panel.id, index)
                  }
                />
              ))}
            </motion.ul>
          </AnimatePresence>

          {editMode && (
            <div className="mt-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const t = newTask.trim();
                    if (t) {
                      onAddTask(panel.id, t);
                      setNewTask("");
                    }
                  }
                }}
                placeholder="New task — press Enter"
                className="w-full rounded-md border border-slate-600/30 bg-slate-950/35 px-3 py-2 font-sans text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                aria-label="New task"
              />
            </div>
          )}
        </div>

        <div className={`border-t border-slate-600/20 ${SANCTUARY_PAD_X} py-3`}>
          <button
            type="button"
            onClick={() => {
              setEditMode((v) => !v);
              setEditingTaskIndex(null);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
          >
            <PencilLine className="h-4 w-4 transition-shadow hover:shadow-[0_0_15px_rgba(230,230,250,0.5)]" />
            {editMode ? "Done editing" : "Edit panel"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
