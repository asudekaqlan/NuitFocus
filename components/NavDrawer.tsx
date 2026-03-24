"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { RefObject } from "react";

const linkClass =
  "flex items-center gap-3 rounded-xl border border-slate-500/35 bg-slate-950/40 px-4 py-3 text-left text-sm text-white/90 transition-all hover:border-slate-500/55 hover:bg-slate-800/45 hover:shadow-[0_0_15px_rgba(230,230,250,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50";

type NavDrawerProps = {
  open: boolean;
  onClose: () => void;
  anchorRef?: RefObject<HTMLElement | null>;
};

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px]"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 z-[70] flex h-full w-[min(88vw,280px)] flex-col border-r border-slate-500/35 bg-slate-900/92 py-6 pl-5 pr-4 shadow-2xl backdrop-blur-md"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            aria-label="Site menu"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-serif text-lg text-white">NuitFocus</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <a
                href="https://github.com/asudekaqlan"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/asude-ay%C5%9Fe-kaplan-933a52338/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                LinkedIn
              </a>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
