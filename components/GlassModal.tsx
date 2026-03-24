"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  COLOR_PRESETS,
  MODAL_ICON_KEYS,
  type ModalIconKey,
} from "@/lib/constants";
import { PanelIcon } from "@/lib/panel-icons";

type GlassModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    color: string;
    icon: ModalIconKey;
  }) => void;
};

export function GlassModal({ open, onClose, onSubmit }: GlassModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [colorId, setColorId] = useState(COLOR_PRESETS[0].id);
  const [iconKey, setIconKey] = useState<ModalIconKey>("Moon");

  useEffect(() => {
    if (open) {
      setTitle("");
      setColorId(COLOR_PRESETS[0].id);
      setIconKey("Moon");
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-panel-title"
            className="relative z-10 w-full max-w-[420px] rounded-2xl border border-slate-500/35 bg-slate-900/88 p-6 shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="new-panel-title" className="font-serif text-xl text-white">
              Add New Panel
            </h2>
            <p className="mt-1 font-sans text-sm text-white/55">
              Title, color, and icon for your focus zone.
            </p>

            <label className="mt-5 block font-sans text-sm text-white/70">
              Title
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-5 mt-1 w-full rounded-lg border border-slate-500/35 bg-slate-950/45 px-3 py-2 font-sans text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                placeholder="e.g. Morning sprint"
              />
            </label>

            <p className="mb-2 font-sans text-sm text-white/70">Color</p>
            <div className="mb-5 flex flex-wrap gap-3">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  className={`h-9 w-9 rounded-full border-2 transition-all hover:shadow-[0_0_15px_rgba(230,230,250,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60 ${
                    colorId === c.id
                      ? "border-white scale-110"
                      : "border-slate-500/50"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${tintFromPreset(c.id)}, rgba(255,255,255,0.15))`,
                  }}
                  title={c.label}
                  aria-label={c.label}
                  aria-pressed={colorId === c.id}
                />
              ))}
            </div>

            <p className="mb-2 font-sans text-sm text-white/70">Icon</p>
            <div className="mb-6 grid grid-cols-4 gap-2">
              {MODAL_ICON_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIconKey(key)}
                  className={`flex h-12 items-center justify-center rounded-xl border transition-all hover:shadow-[0_0_15px_rgba(230,230,250,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60 ${
                    iconKey === key
                      ? "border-white/80 bg-slate-800/55"
                      : "border-slate-500/35 bg-slate-950/35"
                  }`}
                  aria-label={`Icon ${key}`}
                  aria-pressed={iconKey === key}
                >
                  <PanelIcon name={key} className="h-4 w-4 text-white/90" />
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-500/35 px-4 py-2 font-sans text-sm font-medium text-white/85 transition-colors hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const t = title.trim();
                  if (!t) return;
                  onSubmit({ title: t, color: colorId, icon: iconKey });
                  onClose();
                }}
                className="rounded-lg border border-slate-500/35 bg-slate-800/60 px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-slate-700/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 active:scale-[0.98]"
              >
                Add panel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function tintFromPreset(id: string): string {
  const map: Record<string, string> = {
    softMint: "#34d399",
    mutedRose: "#fb7185",
    paleGold: "#fbbf24",
    softLavender: "#a78bfa",
    powderBlue: "#60a5fa",
    dustyPeach: "#fb923c",
  };
  return map[id] ?? "#94a3b8";
}
