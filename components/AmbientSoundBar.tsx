"use client";

import { motion } from "framer-motion";
import { CloudRain, Waves, Wind, type LucideIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import {
  AMBIENT_DEFAULT_TRACK_LINEAR,
  AMBIENT_TRACK_VOLUMES_STORAGE_KEY,
  AMBIENT_TRACKS,
  loadAmbientTrackVolumesFromStorage,
  type AmbientId,
} from "@/lib/ambient-tracks";
import { getAmbientStreamEngine } from "@/lib/ambient-stream-engine";
import {
  AMBIENT_FRAME,
  SANCTUARY_GLASS_FILL,
} from "@/lib/sanctuary-styles";

const ICONS: Record<AmbientId, LucideIcon> = {
  oceanWaves: Waves,
  whiteNoise1: CloudRain,
  whiteNoise2: Wind,
};

export function AmbientSoundBar() {
  const initialActive = (): Record<AmbientId, boolean> =>
    Object.fromEntries(AMBIENT_TRACKS.map((t) => [t.id, false])) as Record<
      AmbientId,
      boolean
    >;

  const [active, setActive] = useState<Record<AmbientId, boolean>>(initialActive);
  const [volumes, setVolumes] = useState<Record<AmbientId, number>>(() =>
    Object.fromEntries(
      AMBIENT_TRACKS.map((t) => [t.id, AMBIENT_DEFAULT_TRACK_LINEAR])
    ) as Record<AmbientId, number>
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    getAmbientStreamEngine().syncTrackCatalog();
    const loaded = loadAmbientTrackVolumesFromStorage();
    setVolumes(loaded);
    getAmbientStreamEngine().setAllTrackVolumes(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const engine = getAmbientStreamEngine();
    engine.setAllTrackVolumes(volumes);
    try {
      window.localStorage.setItem(
        AMBIENT_TRACK_VOLUMES_STORAGE_KEY,
        JSON.stringify(volumes)
      );
    } catch {
      /* ignore */
    }
  }, [volumes, hydrated]);

  const setTrackVol = useCallback((id: AmbientId, linear: number) => {
    setVolumes((prev) => ({ ...prev, [id]: linear }));
  }, []);

  /** Range sliders: call engine immediately — mobile `useEffect` batching felt broken. */
  const applyTrackVolume = useCallback((id: AmbientId, linear: number) => {
    const v = Math.max(0, Math.min(1, linear));
    getAmbientStreamEngine().setTrackVolume(id, v);
    setTrackVol(id, v);
  }, [setTrackVol]);

  const toggle = useCallback(async (id: AmbientId) => {
    const engine = getAmbientStreamEngine();
    if (engine.isPlaying(id)) {
      engine.pause(id);
      setActive((a) => ({ ...a, [id]: false }));
      return;
    }
    // Same synchronous turn as the tap — required for strict mobile browsers.
    engine.playFromUserGesture(id);
    const ok = await engine.play(id);
    setActive((a) => ({ ...a, [id]: ok }));
  }, []);

  return (
    <section
      className="relative mx-auto mb-3 hidden w-full max-w-4xl overflow-visible sm:mb-4 sm:block"
      aria-label="Sesler"
    >
      <div className="grid grid-cols-3 gap-2 pt-1 sm:flex sm:flex-nowrap sm:gap-2 sm:pt-2">
        {AMBIENT_TRACKS.map(({ id, label }) => {
          const Icon = ICONS[id];
          const isOn = active[id];
          const vol = volumes[id] ?? 0.45;
          return (
            <div
              key={id}
              className="group relative min-h-0 min-w-0 sm:flex-1"
            >
              <div
                className="relative z-30 mb-1 flex min-h-11 items-center justify-center px-0.5 py-1 opacity-100 sm:z-10 sm:min-h-0 sm:py-0 sm:absolute sm:inset-x-0 sm:bottom-full sm:mb-0 sm:h-6 sm:pointer-events-none sm:opacity-0 sm:transition-opacity sm:duration-150 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(vol * 100)}
                  onChange={(e) =>
                    applyTrackVolume(id, Number(e.target.value) / 100)
                  }
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    applyTrackVolume(id, Number(e.currentTarget.value) / 100)
                  }
                  className="ambient-track-vol-slider h-2 w-full min-w-0 min-h-[2.75rem] cursor-pointer appearance-none rounded-full bg-slate-600/35 sm:h-1 sm:min-h-0"
                  style={{ touchAction: "pan-x" }}
                  aria-label={`${label} ses seviyesi`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <motion.button
                type="button"
                layout
                style={{ touchAction: "manipulation" }}
                onClick={() => void toggle(id)}
                title={label}
                aria-pressed={isOn}
                aria-label={`${label} — ${isOn ? "durdur" : "çal"}`}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 28,
                }}
                className={`relative z-20 flex min-h-[3rem] w-full touch-manipulation flex-col items-center justify-center gap-1 px-2 py-2.5 text-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 sm:relative sm:z-20 sm:min-h-0 sm:flex-row sm:py-3 ${AMBIENT_FRAME} ${
                  isOn
                    ? "bg-gradient-to-b from-violet-950/45 via-slate-900/72 to-slate-950/88 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.22),inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_18px_-4px_rgba(148,163,184,0.35)] text-violet-50"
                    : `${SANCTUARY_GLASS_FILL} text-white/65 hover:text-white/85`
                }`}
              >
                <Icon
                  size={22}
                  className={isOn ? "text-violet-100" : "text-white/60"}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="max-w-full truncate font-sans text-[10px] font-medium uppercase tracking-wider opacity-90 sm:text-[11px]">
                  {label}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .ambient-track-vol-slider {
          accent-color: rgb(196 181 253 / 0.85);
        }
        .ambient-track-vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          margin-top: -12px;
          border-radius: 9999px;
          background: rgb(30 41 59);
          border: 1px solid rgb(196 181 253 / 0.55);
          box-shadow: 0 0 0 2px rgb(15 23 42 / 0.6),
            0 0 12px rgb(167 139 250 / 0.35);
        }
        .ambient-track-vol-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
        }
        @media (min-width: 640px) {
          .ambient-track-vol-slider::-webkit-slider-thumb {
            width: 12px;
            height: 12px;
            margin-top: 0;
          }
          .ambient-track-vol-slider::-webkit-slider-runnable-track {
            height: auto;
          }
        }
        .ambient-track-vol-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: rgb(30 41 59);
          border: 1px solid rgb(196 181 253 / 0.55);
          box-shadow: 0 0 0 2px rgb(15 23 42 / 0.6),
            0 0 12px rgb(167 139 250 / 0.35);
        }
        .ambient-track-vol-slider::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
        }
        @media (min-width: 640px) {
          .ambient-track-vol-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
          }
          .ambient-track-vol-slider::-moz-range-track {
            height: auto;
          }
        }
      `}</style>
    </section>
  );
}
