"use client";

import { Timer, User } from "lucide-react";
import { useRef, useState } from "react";
import { NavDrawer } from "./NavDrawer";
import { PomodoroPopover } from "./PomodoroPopover";

export function TopBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pomOpen, setPomOpen] = useState(false);
  const pomAnchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-600/35 bg-slate-900/75 backdrop-blur-md shadow-[0_4px_28px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mr-auto flex items-center gap-2 rounded-xl border border-slate-500/35 bg-slate-950/40 px-3 py-2 font-sans text-sm font-medium text-white/90 transition-all hover:border-slate-500/50 hover:bg-slate-800/50 hover:shadow-[0_0_15px_rgba(230,230,250,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 active:scale-[0.98]"
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            aria-label="About Me — open menu"
          >
            <User className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            About Me
          </button>
          <button
            ref={pomAnchorRef}
            type="button"
            onClick={() => setPomOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-500/35 bg-slate-950/40 px-3 py-2 font-sans text-sm font-medium text-white/90 transition-all hover:border-slate-500/50 hover:bg-slate-800/50 hover:shadow-[0_0_15px_rgba(230,230,250,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 active:scale-[0.98]"
            aria-expanded={pomOpen}
            aria-haspopup="dialog"
          >
            <Timer className="h-4 w-4" strokeWidth={1.75} />
            Pomodoro
          </button>
        </div>
      </header>
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <PomodoroPopover
        open={pomOpen}
        onClose={() => setPomOpen(false)}
        anchorRef={pomAnchorRef}
      />
    </>
  );
}
