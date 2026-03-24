import { NEW_PANEL_THEME_ID } from "./constants";

export type PanelTheme = {
  iconBg: string;
  tint: string;
  headerBar: string;
};

/** Soft slate strip — avoids a bright “white line” between header and tasks. */
const HEADER_BAR =
  "border-b border-slate-600/20 bg-slate-950/35 backdrop-blur-sm";

/** Same gray “frame” + surface for every panel icon (border/ring/fill). */
const PANEL_ICON_SURFACE =
  "border border-slate-500/45 bg-slate-900/90 text-slate-100 shadow-inner ring-1 ring-slate-500/40";

const CORE_THEMES: Record<string, PanelTheme> = {
  deepNavy: {
    iconBg: PANEL_ICON_SURFACE,
    tint: "bg-gradient-to-br from-slate-800/35 via-transparent to-slate-950/25",
    headerBar: HEADER_BAR,
  },
  mutedPurple: {
    iconBg: PANEL_ICON_SURFACE,
    tint: "bg-gradient-to-br from-violet-950/40 via-transparent to-slate-950/30",
    headerBar: HEADER_BAR,
  },
  sageNight: {
    iconBg: PANEL_ICON_SURFACE,
    tint: "bg-gradient-to-br from-emerald-950/35 via-transparent to-slate-950/30",
    headerBar: HEADER_BAR,
  },
  abyssTeal: {
    iconBg: PANEL_ICON_SURFACE,
    tint: "bg-gradient-to-br from-teal-950/40 via-transparent to-slate-950/30",
    headerBar: HEADER_BAR,
  },
};

const THEME_ALIASES: Record<string, string> = {
  twilightGold: "sageNight",
};

export function getPanelTheme(colorId: string): PanelTheme {
  const id = THEME_ALIASES[colorId] ?? colorId;
  const core = CORE_THEMES[id];
  if (core) return core;
  return CORE_THEMES[NEW_PANEL_THEME_ID] ?? CORE_THEMES.deepNavy;
}
