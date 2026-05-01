name: slicing-implementation
description: 'UI slicing implementation phase by phase for the cukkr-frontend project. Use this skill to continue unfinished implementations from track_pages_and_components.md, following page descriptions from ui-ux-pages-descriptions.md and PNG references in ui-ux-pages-pngs/. One phase at a time, check off each completed item, and update index.tsx for navigation.'
argument-hint: 'Specify the phase you want to work on, or leave empty to continue to the next unfinished phase.'
# Slicing Implementation

## Objective
Continue UI (slicing) implementation in a consistent and structured way, phase by phase, based on tracking in `docs/track_pages_and_components.md`.

## Main Rules
- **One phase at a time** — do not start the next phase before finishing the current one.
- **Read PNGs only when needed** — do not load all images at once. Only read PNGs for the page/component currently being worked on.
- **Checklist each completed item** — immediately update `[x]` in the `slicing_implemented` column in `docs/track_pages_and_components.md` after finishing a page/component.
- **Update `app/index.tsx`** — for every completed page, add a navigation link to `app/index.tsx` in the appropriate section (create a new section if it does not exist).
- **Reusable components can be built first** — if shared components are needed before pages, build them first, but still mark them in tracking.

## Procedure

### Step 1 — Determine the active phase
1. Read `docs/track_pages_and_components.md`.
2. Find the first phase that still has items with `slicing_implemented: []`.
3. Show a summary: phase name and list of unfinished pages/components.
4. Confirm the phase with the user (or continue automatically if already specified).

### Step 2 — Determine implementation order within the phase
Prioritize in this order:
1. Shared/reusable components that are dependencies for pages in this phase.
2. Pages whose dependencies are already available.
3. Pages whose dependencies are not yet available (build components first).

### Step 3 — Implement one item
For each page or component:
1. **Read the PNG reference** from `lokasi_referensi_png` for that item only.
2. **Read the page description** from `docs/ui-ux-pages-descriptions.md` if available.
3. **Check existing structure, create if needed** — check related files in `src/features/` or `src/components/`.
4. **Implement** following existing project patterns:
   - Feature-specific components → `src/features/<feature>/components/`
   - Screen → `src/features/<feature>/screens/`
   - Route → `app/<scope>/<page>.tsx` (thin, only mounts screen)
   - Global reusable components → `src/components/`
5. Use relevant theme files (`auth-theme.ts`, `onboarding-theme.ts`, etc.) for colors and spacing.

### Step 4 — Checklist and update index
After completing an item:
1. Update `docs/track_pages_and_components.md`: change `[]` → `[x]` in `slicing_implemented` column.
2. If it is a new page, add a `Link` to `app/index.tsx` in the appropriate phase section.

### Step 5 — Continue or stop
- Continue to the next item within the same phase.
- After all items in the phase are completed, report a summary to the user and **stop** — do not automatically start the next phase without confirmation.

### Step 6 — Git commit
- Before committing, ensure there are no errors using `npx tsc --noEmit` and `npm run lint`. Fix any issues if found.
- Run `git add` and create a clear commit message, for example: `feat: implement slicing for <page/component name>`, then push to the `dev` branch.

## File References
- Tracking: [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md)
- Page descriptions: [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md)
- PNG references: `ui-ux-pages-pngs/` (read per item, not all at once)
- Debug navigation: [app/index.tsx](../../../app/index.tsx)
- Project structure: [AGENTS.md](../../../AGENTS.md)
