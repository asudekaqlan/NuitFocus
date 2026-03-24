"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SEED_PANELS, STORAGE_KEY } from "@/lib/constants";
import type { ModalIconKey } from "@/lib/constants";
import { normalizePanels } from "@/lib/normalize-panels";
import type { Panel } from "@/lib/types";
import { AmbientSoundBar } from "./AmbientSoundBar";
import { CategoryPanel } from "./CategoryPanel";
import { GlassModal } from "./GlassModal";
import { TopBar } from "./TopBar";

export function Dashboard() {
  const [panels, setPanels] = useState<Panel[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        const normalized = normalizePanels(parsed);
        if (normalized.length > 0) {
          setPanels(normalized);
        } else {
          setPanels(SEED_PANELS);
        }
      } else {
        setPanels(SEED_PANELS);
      }
    } catch {
      setPanels(SEED_PANELS);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || panels === null) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
  }, [panels, hydrated]);

  const updateTitle = useCallback((id: string, title: string) => {
    setPanels((prev) =>
      prev?.map((p) => (p.id === id ? { ...p, title } : p)) ?? null
    );
  }, []);

  const deletePanel = useCallback((id: string) => {
    setPanels((prev) => prev?.filter((p) => p.id !== id) ?? null);
  }, []);

  const updateTask = useCallback(
    (panelId: string, taskIndex: number, text: string) => {
      setPanels((prev) =>
        prev?.map((p) => {
          if (p.id !== panelId) return p;
          const tasks = [...p.tasks];
          const cur = tasks[taskIndex];
          if (!cur) return p;
          tasks[taskIndex] = { ...cur, text };
          return { ...p, tasks };
        }) ?? null
      );
    },
    []
  );

  const toggleTaskComplete = useCallback(
    (panelId: string, taskIndex: number) => {
      setPanels((prev) =>
        prev?.map((p) => {
          if (p.id !== panelId) return p;
          const tasks = p.tasks.map((t, i) =>
            i === taskIndex ? { ...t, completed: !t.completed } : t
          );
          return { ...p, tasks };
        }) ?? null
      );
    },
    []
  );

  const deleteTask = useCallback((panelId: string, taskIndex: number) => {
    setPanels((prev) =>
      prev?.map((p) => {
        if (p.id !== panelId) return p;
        const tasks = p.tasks.filter((_, i) => i !== taskIndex);
        return { ...p, tasks };
      }) ?? null
    );
  }, []);

  const addTask = useCallback((panelId: string, text: string) => {
    setPanels((prev) =>
      prev?.map((p) =>
        p.id === panelId
          ? { ...p, tasks: [...p.tasks, { text, completed: false }] }
          : p
      ) ?? null
    );
  }, []);

  const addPanel = useCallback(
    (payload: { title: string; color: string; icon: ModalIconKey }) => {
      const newPanel: Panel = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `panel-${Date.now()}`,
        title: payload.title,
        color: payload.color,
        icon: payload.icon,
        tasks: [],
      };
      setPanels((prev) => [...(prev ?? []), newPanel]);
    },
    []
  );

  if (panels === null) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-sm text-white/50">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen overflow-x-hidden px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <TopBar />
      <header className="mx-auto mb-4 flex max-w-7xl flex-col items-center gap-3 text-center sm:mb-5 sm:gap-4">
        <h1 className="font-serif text-3xl tracking-tight text-white drop-shadow-sm sm:text-4xl">
          NuitFocus
        </h1>
        <p className="max-w-xl px-2 text-center text-balance font-serif text-xs font-normal leading-relaxed tracking-wide text-white/65 sm:max-w-2xl sm:text-sm">
          <span className="italic text-white/[0.72]">
            &ldquo;Great things are done by a series of small things brought
            together.&rdquo;
          </span>{" "}
          <span className="text-white/55">&mdash; Vincent Van Gogh</span>
        </p>
        <div className="mt-3 w-full sm:mt-5">
          <AmbientSoundBar />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {panels.map((panel) => (
          <CategoryPanel
            key={panel.id}
            panel={panel}
            onUpdateTitle={updateTitle}
            onDeletePanel={deletePanel}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
            onToggleTaskComplete={toggleTaskComplete}
          />
        ))}
      </div>

      <div className="mx-auto mt-12 mb-10 flex max-w-7xl justify-center pb-8">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-full border border-slate-500/40 bg-slate-900/85 px-6 py-3 font-sans text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:border-slate-500/55 hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(230,230,250,0.3)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
        >
          <Plus className="h-5 w-5 transition-shadow hover:shadow-[0_0_15px_rgba(230,230,250,0.5)]" />
          Add New Panel
        </button>
      </div>

      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addPanel}
      />
    </div>
  );
}
