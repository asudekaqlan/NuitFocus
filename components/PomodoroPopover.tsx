"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type PomodoroPopoverProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
};

const DEFAULT_MIN = 25;

function formatMmSs(totalSec: number) {
  const m = Math.floor(Math.max(0, totalSec) / 60);
  const s = Math.max(0, totalSec) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PomodoroPopover({
  open,
  onClose,
  anchorRef,
}: PomodoroPopoverProps) {
  const [durationSec, setDurationSec] = useState(DEFAULT_MIN * 60);
  const [remaining, setRemaining] = useState(DEFAULT_MIN * 60);
  const [running, setRunning] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editMinutes, setEditMinutes] = useState(String(DEFAULT_MIN));
  const popoverRef = useRef<HTMLDivElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);

  const applyDuration = useCallback((minutes: number) => {
    const m = Math.max(1, Math.min(180, Math.round(minutes)));
    const sec = m * 60;
    setDurationSec(sec);
    setRemaining(sec);
    setRunning(false);
    setEditMode(false);
    setEditMinutes(String(m));
  }, []);

  const cancelDurationEdit = useCallback(() => {
    setEditMinutes(String(Math.round(durationSec / 60)));
    setEditMode(false);
  }, [durationSec]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!open) {
      setEditMode(false);
    }
  }, [open]);

  useEffect(() => {
    if (editMode && minutesInputRef.current) {
      minutesInputRef.current.focus();
      minutesInputRef.current.select();
    }
  }, [editMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (editMode) {
        e.preventDefault();
        cancelDurationEdit();
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, editMode, cancelDurationEdit]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, onClose, anchorRef]);

  const openDurationEditor = () => {
    setRunning(false);
    setEditMinutes(String(Math.round(durationSec / 60)));
    setEditMode(true);
  };

  const commitDurationEdit = () => {
    const parsed = parseFloat(editMinutes.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setEditMinutes(String(Math.round(durationSec / 60)));
      setEditMode(false);
      return;
    }
    applyDuration(parsed);
  };

  const handleStart = () => {
    if (remaining <= 0) {
      setRemaining(durationSec);
    }
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popoverRef}
          key="pomodoro-popover"
          role="dialog"
          aria-label="Pomodoro timer"
          className="fixed right-4 top-16 z-[55] w-[min(92vw,320px)] rounded-2xl border border-slate-500/35 bg-slate-900/88 p-5 shadow-2xl backdrop-blur-md sm:right-6"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 340 }}
        >
          <p className="mb-1 font-serif text-lg text-white">Pomodoro</p>
          <p className="mb-4 font-sans text-xs text-white/50">
            Focus block — tap the time to set minutes
          </p>

          <div className="mb-5">
            {editMode ? (
              <div className="flex flex-col items-stretch gap-2">
                <label
                  htmlFor="pomodoro-minutes"
                  className="text-left font-sans text-xs text-white/60"
                >
                  Minutes (1–180)
                </label>
                <input
                  ref={minutesInputRef}
                  id="pomodoro-minutes"
                  type="number"
                  min={1}
                  max={180}
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitDurationEdit();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelDurationEdit();
                    }
                  }}
                  onBlur={(e) => {
                    const rt = e.relatedTarget as Node | null;
                    if (rt && popoverRef.current?.contains(rt)) return;
                    cancelDurationEdit();
                  }}
                  className="rounded-lg border border-slate-500/35 bg-slate-950/50 px-3 py-2 font-sans text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                />
                <p className="font-sans text-[11px] text-white/40">
                  Enter — apply · Esc — cancel
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={openDurationEditor}
                className="group flex w-full flex-col items-center rounded-xl border border-transparent py-2 transition-colors hover:border-slate-500/30 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
                aria-label={`Change duration. Current time ${formatMmSs(remaining)}`}
              >
                <span
                  className="font-sans text-4xl font-medium tabular-nums tracking-tight text-white drop-shadow-sm group-hover:text-violet-100/95"
                  aria-live="polite"
                >
                  {formatMmSs(remaining)}
                </span>
                <span className="mt-1 font-sans text-[11px] text-white/35 group-hover:text-white/50">
                  Tap to edit length
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 font-sans">
            <button
              type="button"
              onClick={handleStart}
              disabled={running || editMode}
              className="min-w-[5rem] flex-1 rounded-lg border border-slate-500/35 bg-slate-950/45 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800/55 hover:shadow-[0_0_12px_rgba(230,230,250,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
            >
              Start
            </button>
            <button
              type="button"
              onClick={handlePause}
              disabled={!running || editMode}
              className="min-w-[5rem] flex-1 rounded-lg border border-slate-500/35 bg-slate-950/45 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800/55 hover:shadow-[0_0_12px_rgba(230,230,250,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
            >
              Pause
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
