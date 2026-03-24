import type { Panel } from "./types";

export const STORAGE_KEY = "nuitfocus-panels-v1";

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

export type ColorPreset = {
  id: string;
  label: string;
  border: string;
  iconBg: string;
};

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "softMint",
    label: "Soft Mint",
    border: "border-l-[#6ee7c5]",
    iconBg: "bg-teal-400/20 text-teal-100",
  },
  {
    id: "mutedRose",
    label: "Muted Rose",
    border: "border-l-[#f0abbd]",
    iconBg: "bg-rose-400/20 text-rose-100",
  },
  {
    id: "paleGold",
    label: "Pale Gold",
    border: "border-l-[#f5d88a]",
    iconBg: "bg-amber-400/20 text-amber-100",
  },
  {
    id: "softLavender",
    label: "Soft Lavender",
    border: "border-l-[#c4b5fd]",
    iconBg: "bg-violet-400/20 text-violet-100",
  },
  {
    id: "powderBlue",
    label: "Powder Blue",
    border: "border-l-[#93c5fd]",
    iconBg: "bg-sky-400/20 text-sky-100",
  },
  {
    id: "dustyPeach",
    label: "Dusty Peach",
    border: "border-l-[#fdba8c]",
    iconBg: "bg-orange-400/20 text-orange-100",
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
