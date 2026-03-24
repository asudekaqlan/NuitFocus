import {
  Book,
  Brain,
  Code,
  Coffee,
  Headphones,
  Moon,
  Pencil,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Book,
  Code,
  Moon,
  Pencil,
  Headphones,
  Brain,
  Coffee,
  Sparkles,
};

type PanelIconProps = {
  name: string;
  className?: string;
};

export function PanelIcon({ name, className }: PanelIconProps) {
  const Icon = MAP[name] ?? Moon;
  return <Icon className={className} aria-hidden />;
}
