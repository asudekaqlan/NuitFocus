import type { TaskEntry } from "./types";
import type { Panel } from "./types";

function isTaskEntry(x: unknown): x is TaskEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.text === "string" && typeof o.completed === "boolean";
}

function isPanel(x: unknown): x is Panel {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return false;
  if (typeof o.icon !== "string" || typeof o.color !== "string") return false;
  if (!Array.isArray(o.tasks)) return false;
  return o.tasks.every(isTaskEntry);
}

export function normalizePanels(raw: unknown): Panel[] {
  if (!Array.isArray(raw)) return [];
  const out: Panel[] = [];
  for (const item of raw) {
    if (!isPanel(item)) continue;
    out.push({
      id: item.id,
      title: item.title,
      icon: item.icon,
      color: item.color,
      tasks: item.tasks.map((t) => ({ ...t })),
    });
  }
  return out;
}
