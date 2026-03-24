import type { Panel } from "./types";

export const STORAGE_KEY = "nuitfocus-panels-v1";

/** Theme id for panels created via “Add New Panel” (matches `getPanelTheme` core themes). */
export const NEW_PANEL_THEME_ID = "deepNavy";

export const SEED_PANELS: Panel[] = [
  {
    id: "seed-deep-work",
    title: "Deep Work",
    icon: "Moon",
    color: "deepNavy",
    tasks: [
      { text: "Math Proofs", completed: false },
      { text: "Logic Puzzle", completed: false },
    ],
  },
  {
    id: "seed-creative-spark",
    title: "Creative Spark",
    icon: "Pencil",
    color: "mutedPurple",
    tasks: [
      { text: "UI Sketching", completed: false },
      { text: "Brainstorming", completed: false },
    ],
  },
  {
    id: "seed-night-rituals",
    title: "Night Rituals",
    icon: "Coffee",
    color: "sageNight",
    tasks: [
      { text: "Journaling", completed: false },
      { text: "Tea Time", completed: false },
    ],
  },
  {
    id: "seed-growth-logic",
    title: "Growth & Logic",
    icon: "Brain",
    color: "abyssTeal",
    tasks: [
      { text: "Japanese N5 Kanji", completed: false },
      { text: "Strategy Game", completed: false },
    ],
  },
];

export const MODAL_ICON_KEYS = [
  "Book",
  "Code",
  "Moon",
  "Pencil",
  "Headphones",
  "Brain",
  "Coffee",
  "Sparkles",
] as const;

export type ModalIconKey = (typeof MODAL_ICON_KEYS)[number];

export const STARDUST_SPECS = Array.from({ length: 22 }, (_, i) => ({
  left: ((i * 41) % 97) + 1,
  top: ((i * 29) % 94) + 3,
  size: 1 + (i % 3),
  duration: 3.2 + (i % 5) * 0.35,
  delay: (i % 6) * 0.4,
}));
