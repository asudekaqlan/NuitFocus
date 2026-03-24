/** Same outer rim + radius as category panels (use with matching fills). */
export const SANCTUARY_FRAME =
  "rounded-2xl border border-slate-500/45";

/** Panel/sound box glass fill — pairs with {@link SANCTUARY_FRAME}. */
export const SANCTUARY_GLASS_FILL =
  "bg-gradient-to-b from-slate-900/72 to-slate-950/88 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.22)]";

/** Muted slate outline. */
export const SANCTUARY_SHELL = `${SANCTUARY_FRAME} ${SANCTUARY_GLASS_FILL}`;

/** Ambient tiles: always neutral gray border (no violet rim). */
export const AMBIENT_FRAME =
  "rounded-2xl border border-slate-500/50";

export const SANCTUARY_CARD = SANCTUARY_SHELL;

export const SANCTUARY_PAD_X = "px-4 sm:px-5";

export const SANCTUARY_PAD = `${SANCTUARY_PAD_X} py-4`;
