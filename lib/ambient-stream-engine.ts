import {
  AMBIENT_DEFAULT_TRACK_LINEAR,
  AMBIENT_TRACK_GAIN,
  AMBIENT_TRACKS,
  AMBIENT_TRACK_URL,
  AMBIENT_TRACK_URL_FALLBACK,
  type AmbientId,
} from "./ambient-tracks";

function canPlayOggVorbis(): boolean {
  if (typeof document === "undefined") return false;
  const a = document.createElement("audio");
  return a.canPlayType('audio/ogg; codecs="vorbis"') !== "";
}

function mediaReady(el: HTMLAudioElement): boolean {
  return (
    el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && el.error === null
  );
}

function waitForCanPlay(
  el: HTMLAudioElement,
  timeoutMs = 18000
): Promise<boolean> {
  if (mediaReady(el)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      window.clearTimeout(timer);
      el.removeEventListener("loadeddata", onProgress);
      el.removeEventListener("canplay", onProgress);
      el.removeEventListener("canplaythrough", onProgress);
      el.removeEventListener("error", onError);
    };
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(ok);
    };
    const onProgress = () => {
      if (mediaReady(el)) finish(true);
    };
    const onError = () => finish(false);

    el.addEventListener("loadeddata", onProgress);
    el.addEventListener("canplay", onProgress);
    el.addEventListener("canplaythrough", onProgress);
    el.addEventListener("error", onError, { once: true });

    const timer = window.setTimeout(() => {
      finish(mediaReady(el));
    }, timeoutMs);

    // Do not call `load()` here: it resets the element and aborts an in-flight
    // fetch started by `play()`. That breaks mobile Safari where the first
    // play() primes loading and the second play() must not restart from scratch.
    if (
      el.readyState === HTMLMediaElement.HAVE_NOTHING &&
      el.networkState === HTMLMediaElement.NETWORK_EMPTY
    ) {
      try {
        el.load();
      } catch {
        finish(false);
      }
    }
  });
}

let sharedEngine: AmbientStreamEngine | null = null;

export function getAmbientStreamEngine(): AmbientStreamEngine {
  if (!sharedEngine) sharedEngine = new AmbientStreamEngine();
  return sharedEngine;
}

export class AmbientStreamEngine {
  private readonly audios = new Map<AmbientId, HTMLAudioElement>();
  private readonly usingFallback = new Map<AmbientId, boolean>();
  private readonly trackLinear = new Map<AmbientId, number>();

  private gainFor(id: AmbientId): number {
    return AMBIENT_TRACK_GAIN[id] ?? 1;
  }

  private linearForId(id: AmbientId): number {
    const v = this.trackLinear.get(id);
    if (v !== undefined && Number.isFinite(v)) {
      return Math.max(0, Math.min(1, v));
    }
    return AMBIENT_DEFAULT_TRACK_LINEAR;
  }

  private applyVolume(id: AmbientId, el: HTMLAudioElement) {
    el.volume = Math.min(1, this.linearForId(id) * this.gainFor(id));
  }

  /** Per-track user level 0–1 (before `AMBIENT_TRACK_GAIN`). */
  setTrackVolume(id: AmbientId, linear: number) {
    const v = Math.max(0, Math.min(1, linear));
    this.trackLinear.set(id, v);
    const el = this.audios.get(id);
    if (el) this.applyVolume(id, el);
  }

  getTrackVolume(id: AmbientId): number {
    return this.linearForId(id);
  }

  /** Bulk set (e.g. hydrate from localStorage). */
  setAllTrackVolumes(levels: Partial<Record<AmbientId, number>>) {
    for (const [id, linear] of Object.entries(levels) as [
      AmbientId,
      number,
    ][]) {
      if (typeof linear === "number" && Number.isFinite(linear)) {
        this.trackLinear.set(id, Math.max(0, Math.min(1, linear)));
      }
    }
    for (const [id, el] of this.audios.entries()) {
      this.applyVolume(id, el);
    }
  }

  /** Always MP3 first so iOS Safari gets real ambient audio. */
  private initialSrcFor(id: AmbientId): string {
    return AMBIENT_TRACK_URL[id];
  }

  private getOrCreate(id: AmbientId): HTMLAudioElement {
    let el = this.audios.get(id);
    if (!el) {
      el = new Audio();
      el.loop = true;
      el.preload = "auto";
      el.setAttribute("playsinline", "");
      el.setAttribute("webkit-playsinline", "");
      el.src = this.initialSrcFor(id);
      this.usingFallback.set(id, false);
      this.audios.set(id, el);
      if (typeof document !== "undefined") {
        el.setAttribute("data-ambient-id", id);
        el.setAttribute("aria-hidden", "true");
        el.tabIndex = -1;
        el.style.cssText =
          "position:fixed;width:0;height:0;opacity:0;pointer-events:none;left:0;top:0";
        document.body.appendChild(el);
      }
    }
    return el;
  }

  private switchToFallback(id: AmbientId, el: HTMLAudioElement): void {
    if (this.usingFallback.get(id)) return;
    el.src = AMBIENT_TRACK_URL_FALLBACK[id];
    this.usingFallback.set(id, true);
    try {
      el.load();
    } catch {
      /* ignore */
    }
  }

  /**
   * Must run synchronously inside pointer/click dispatch (no await before this)
   * so iOS/Android keep media user activation for `HTMLMediaElement.play()`.
   */
  playFromUserGesture(id: AmbientId): void {
    const el = this.getOrCreate(id);
    this.applyVolume(id, el);
    try {
      void el.play();
    } catch {
      /* play() may throw before returning a promise */
    }
  }

  async play(id: AmbientId): Promise<boolean> {
    const el = this.getOrCreate(id);
    this.applyVolume(id, el);

    const attemptPlay = async (): Promise<"ok" | "decode_fail" | "play_fail"> => {
      // iOS Safari only unlocks audio if `play()` runs in the same user-activation
      // turn as the tap. Awaiting `waitForCanPlay` first breaks that chain.
      try {
        await el.play();
        if (!el.paused) return "ok";
      } catch {
        /* not enough buffered yet — fall through */
      }

      const ready = await waitForCanPlay(el);
      if (!ready || el.error) {
        return "decode_fail";
      }
      try {
        await el.play();
        return el.paused ? "play_fail" : "ok";
      } catch {
        return "play_fail";
      }
    };

    let result = await attemptPlay();
    if (result === "ok") {
      return true;
    }

    if (
      result === "decode_fail" &&
      canPlayOggVorbis() &&
      !this.usingFallback.get(id)
    ) {
      this.switchToFallback(id, el);
      result = await attemptPlay();
      return result === "ok";
    }

    return false;
  }

  pause(id: AmbientId) {
    const el = this.audios.get(id);
    if (el) {
      el.pause();
    }
  }

  isPlaying(id: AmbientId): boolean {
    const el = this.audios.get(id);
    return Boolean(el && !el.paused);
  }

  syncTrackCatalog() {
    const allowed = new Set<AmbientId>(AMBIENT_TRACKS.map((t) => t.id));
    for (const id of [...this.audios.keys()]) {
      if (!allowed.has(id)) {
        const el = this.audios.get(id)!;
        el.pause();
        el.removeAttribute("src");
        el.load();
        el.remove();
        this.audios.delete(id);
        this.usingFallback.delete(id);
      }
    }
  }

  dispose() {
    for (const el of this.audios.values()) {
      el.pause();
      el.removeAttribute("src");
      el.load();
      el.remove();
    }
    this.audios.clear();
    this.usingFallback.clear();
  }
}
