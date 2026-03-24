# NuitFocus — Development Tasks

This document breaks the [PDR.md](./PDR.md) roadmap into actionable sub-tasks aligned with [.cursorrules](./.cursorrules) (Next.js App Router, TypeScript, glassmorphism, Framer Motion, hydration-safe `localStorage`).

---

## Conventions (apply to every phase)

- [ ] **Stack:** Next.js 14+ (App Router), Tailwind CSS, `lucide-react`, Framer Motion, TypeScript, functional components only.
- [ ] **Panel model:** Each panel is `{ id: string, title: string, icon: string, color: string, tasks: string[] }`.
- [ ] **Persistence:** Read/write `localStorage` only inside `useEffect` (or after mount) to avoid hydration mismatches.
- [ ] **Panels:** `backdrop-blur-md`, `bg-white/10`, `border-white/20`; background gradient `#0F172A` → `#1E1B4B`; fixed ~2% opacity grain overlay; headings serif (Playfair Display), body/tasks sans (Inter or Geist).

---

## Phase 0 — Project bootstrap

- [ ] **0.1** Create Next.js app (App Router, TypeScript, ESLint; include Tailwind if using the official template).
- [ ] **0.2** Install and configure dependencies: `tailwindcss`, `lucide-react`, `framer-motion`.
- [ ] **0.3** Add Google fonts (or `next/font`): Playfair Display for headings, Inter or Geist for UI/tasks; wire into `layout.tsx` and Tailwind `theme.extend.fontFamily`.
- [ ] **0.4** Remove or trim default starter UI so the app shell is ready for the dashboard layout.

**Done when:** `npm run dev` serves a blank or minimal page with correct global fonts and no console errors.

---

## Phase 1 — The shell (layout & atmosphere)

- [ ] **1.1** Apply full-viewport gradient background (top-left `#0F172A` to bottom-right `#1E1B4B`) on the root layout or main page wrapper.
- [ ] **1.2** Add a fixed full-screen grain/noise overlay at ~2% opacity (CSS pseudo-element, SVG filter, or small repeating texture) so it does not block pointer events.
- [ ] **1.3** Implement main dashboard grid: responsive **4-column** layout for the four default panels (collapse to fewer columns on small screens as needed).
- [ ] **1.4** Reserve space for the bottom-centered **+ Add New Panel** control (can be a placeholder until Phase 3).

**Done when:** Opening the app shows the night gradient, grain, and a grid that can hold four panels without layout shift from fonts.

---

## Phase 2 — Glass panel component

- [ ] **2.1** Create `CategoryPanel` (or equivalent) accepting props: `title`, `icon` (key or name mappable to Lucide), `color`, `tasks[]`, plus callbacks/handlers stubs for later phases.
- [ ] **2.2** Style the panel with mandatory glass tokens: `backdrop-blur-md`, `bg-white/10`, `border-white/20`; use `color` for accents (border tint, left stripe, icon background, etc.) per design consistency.
- [ ] **2.3** **View mode:** Render category title with icon; list tasks as readable text (sans-serif).
- [ ] **2.4** **Edit mode toggle:** Bottom-of-panel control switches between View and Edit; animate the transition with Framer Motion where it improves clarity.
- [ ] **2.5** Extract `TaskItem` (or inline equivalent): in Edit mode, task row shows delete control (glowing red **X** on the right); clicking task text swaps to an inline text input for editing.
- [ ] **2.6** Category title row: in Edit mode, show small **trash** icon next to title for delete-category (wire to no-op or confirm placeholder until Phase 3).

**Done when:** A single panel can be toggled View/Edit, tasks render, and UI matches glass + typography rules (logic can be local state only for this phase).

---

## Phase 3 — Logic, state & persistence

- [ ] **3.1** Define TypeScript types/interfaces for `Panel` and app state (`Panel[]`).
- [ ] **3.2** Implement **default seed data** on first load (no `localStorage` key yet):

  | Title            | Sample tasks                          |
  |------------------|---------------------------------------|
  | Deep Work        | Math Proofs, Logic Puzzle             |
  | Creative Spark   | UI Sketching, Brainstorming           |
  | Night Rituals    | Journaling, Tea Time                  |
  | Growth & Logic   | Japanese N5 Kanji, Strategy Game      |

- [ ] **3.3** **localStorage:** On mount, read saved panels; if missing, use seed. On state change, debounce or batch writes in `useEffect` so the client never reads `localStorage` during SSR render.
- [ ] **3.4** **Tasks:** Add task (Edit mode: “New Task” input, **Enter** to save); delete task (red X); inline edit task text (blur or Enter to commit—pick one pattern and use consistently).
- [ ] **3.5** **Categories:** Delete category (trash next to title) with confirmation or undo if you want safer UX (PRD implies direct delete—document choice in code comments only if non-obvious).
- [ ] **3.6** **Add New Panel:** Bottom-center **+** opens customization flow (see Phase 3b). On submit, append a new `Panel` with unique `id` (e.g. `crypto.randomUUID()` or nanoid).

### Phase 3b — Customization modal

- [ ] **3b.1** Build `GlassModal` (or similar): glass styling consistent with panels; open/close animated with Framer Motion.
- [ ] **3b.2** **Title** text field.
- [ ] **3b.3** **Color:** Row of **6** preset pastel circles (e.g. Soft Mint, Muted Rose, Pale Gold—names optional in UI).
- [ ] **3b.4** **Icon:** Grid of **6–8** Lucide icons (e.g. Book, Code, Moon, Pencil, Headphones, Brain—plus 0–2 more to reach count).
- [ ] **3b.5** Submit creates panel with selected title, color token, and icon key; cancel closes without mutation.

**Done when:** Refresh preserves panels/tasks; all CRUD paths update `localStorage`; new panels appear in the grid; modal matches glass theme.

---

## Phase 4 — Polish & motion

- [ ] **4.1** **Icon hover:** Neon lavender glow on interactive icons, e.g. `hover:shadow-[0_0_15px_rgba(230,230,250,0.5)]` (and transitions via Framer Motion or Tailwind as appropriate).
- [ ] **4.2** **Stardust background:** Subtle floating vertical motion (loop) on background particles/layer; implement with Framer Motion so it feels smooth, not distracting.
- [ ] **4.3** **Micro-interactions:** Hover/active states on buttons, modal triggers, and panel edit toggle (per .cursorrules).
- [ ] **4.4** **Accessibility pass:** Focus rings on inputs/modal, keyboard dismiss (Escape) for modal, semantic headings, sufficient contrast on text over glass.

**Done when:** Motion and glow match PRD; no hydration warnings; Lighthouse/a11y basics acceptable for a personal dashboard.

---

## Optional follow-ups (out of core PRD)

- [ ] Export/import JSON backup of panels.
- [ ] Drag-and-drop reorder for panels or tasks.
- [ ] Dark/light is out of scope—do not add unless requirements change.

---

## Suggested component map

| Component        | Responsibility                                      |
|-----------------|-----------------------------------------------------|
| `app/layout.tsx`| Fonts, global gradient + grain shell                |
| `app/page.tsx`  | Panel grid, top-level state, `localStorage` sync    |
| `CategoryPanel` | View/Edit UI, task list, edit toggle                |
| `TaskItem`      | Display, inline edit, delete                        |
| `GlassModal`    | Add-panel form (title, color presets, icon grid)    |
| `Stardust` (optional) | Animated background layer                     |

Use this list as a guide; adjust file paths to match your App Router structure (`components/`, etc.).

---

## Verification checklist (before “done”)

- [ ] Four default panels on first visit; data survives refresh.
- [ ] Glass + gradient + grain always visible.
- [ ] Serif headings, sans body/tasks.
- [ ] Lucide icons only; Framer Motion for modal and meaningful transitions.
- [ ] No `localStorage` access during initial server render.
