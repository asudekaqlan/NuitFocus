/**
 * Ambient tracks: primary = MP3 (iOS Safari + all major browsers).
 * Wikimedia Commons transcoded MP3s (see file pages for licenses).
 * Fallback = Google Assistant Sound Library OGG (desktop; iOS often cannot decode OGG).
 */

export type AmbientId = "oceanWaves" | "whiteNoise1" | "whiteNoise2";

export type AmbientTrackMeta = {
  id: AmbientId;
  label: string;
};

/**
 * MP3 — works on mobile Safari. Sources:
 * - Waves: https://commons.wikimedia.org/wiki/File:Waves.ogg (public domain)
 * - Garden rain: https://commons.wikimedia.org/wiki/File:Garden_rainfall.ogg (Free Art License)
 * - Howling wind: https://commons.wikimedia.org/wiki/File:Howling_wind.ogg (CC0)
 */
export const AMBIENT_TRACK_URL: Record<AmbientId, string> = {
  oceanWaves:
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1f/Waves.ogg/Waves.ogg.mp3",
  whiteNoise1:
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/55/Garden_rainfall.ogg/Garden_rainfall.ogg.mp3",
  whiteNoise2:
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/2/2d/Howling_wind.ogg/Howling_wind.ogg.mp3",
};

/** OGG fallback when primary MP3 fails and the browser supports Vorbis. */
export const AMBIENT_TRACK_URL_FALLBACK: Record<AmbientId, string> = {
  oceanWaves:
    "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg",
  whiteNoise1:
    "https://actions.google.com/sounds/v1/weather/light_rain.ogg",
  whiteNoise2:
    "https://actions.google.com/sounds/v1/weather/strong_wind.ogg",
};

export const AMBIENT_TRACK_GAIN: Record<AmbientId, number> = {
  oceanWaves: 1.2,
  whiteNoise1: 0.925,
  whiteNoise2: 0.65,
};

export const AMBIENT_TRACKS: AmbientTrackMeta[] = [
  { id: "oceanWaves", label: "Ocean Waves" },
  { id: "whiteNoise1", label: "Light Rain" },
  { id: "whiteNoise2", label: "Strong Wind" },
];

/** Default per-track linear level before `AMBIENT_TRACK_GAIN`. */
export const AMBIENT_DEFAULT_TRACK_LINEAR = 0.45;

/** Per-track linear volumes 0–1, JSON `Record<AmbientId, number>`. */
export const AMBIENT_TRACK_VOLUMES_STORAGE_KEY =
  "nuitfocus-ambient-track-volumes-v1";

/** @deprecated Migrated once into per-track storage */
export const AMBIENT_VOLUME_STORAGE_KEY = "nuitfocus-ambient-volume-v1";

export function loadAmbientTrackVolumesFromStorage(): Record<
  AmbientId,
  number
> {
  const out = Object.fromEntries(
    AMBIENT_TRACKS.map((t) => [t.id, AMBIENT_DEFAULT_TRACK_LINEAR])
  ) as Record<AmbientId, number>;

  if (typeof window === "undefined") return out;

  try {
    const raw = window.localStorage.getItem(AMBIENT_TRACK_VOLUMES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Record<AmbientId, number>>;
      for (const t of AMBIENT_TRACKS) {
        const v = parsed[t.id];
        if (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1) {
          out[t.id] = v;
        }
      }
      return out;
    }

    const legacy = window.localStorage.getItem(AMBIENT_VOLUME_STORAGE_KEY);
    if (legacy !== null) {
      const v = parseFloat(legacy);
      if (Number.isFinite(v) && v >= 0 && v <= 1) {
        for (const t of AMBIENT_TRACKS) {
          out[t.id] = v;
        }
      }
    }
  } catch {
    /* ignore */
  }

  return out;
}
