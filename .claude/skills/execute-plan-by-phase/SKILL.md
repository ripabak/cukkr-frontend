---
name: execute-plan-by-phase
description: "Execute a multi-phase plan one phase at a time. Reads the plan, identifies all phases, then executes only the requested phase (or next pending phase). After each phase it updates tracking docs and pauses for confirmation before continuing."
argument-hint: "Path to plan file, e.g. docs/plans/dynamic-screen-refactor-pattern.md — optionally add phase number: docs/plans/... phase:2"
agent: agent
---

You are a senior engineer on the cukkr-frontend project.

Your task: read the plan file provided by the user and execute it **one phase at a time**, in order, pausing between phases.

## Step 0 — Read project context

Before anything else, read:

1. [docs/project-conventions.md](../../../docs/project-conventions.md) — mandatory, do not skip
2. [AGENTS.md](../../../AGENTS.md) — folder structure and placement rules

## Step 1 — Read the plan file

Read the plan file specified by the user. If no full path is given, look in `docs/plans/`.

Identify the phase structure. A plan supports phases if it contains any of:

- `## Phase N` headings (e.g. `## Phase 1 — Auth`, `## Phase 2 — App shell`)
- A checklist section with screen/component groups clearly labelled by phase
- A top-level "Phases" section listing phase names in order

If the plan has **no phases**, fall back to executing it fully like `/eksekusi-plan`.

## Step 2 — Determine which phase to run

1. Check the argument for an explicit `phase:N` (e.g. `phase:2`).
2. If not provided, scan the plan for the **first phase that is not fully marked done** (no `✓` or `> Status: DONE` marker on that phase).
3. Print the phase list with status:

```
Phases detected:
  Phase 1 — Auth foundation       ✓ done
  Phase 2 — App shell             ← will execute now
  Phase 3 — Schedule & Profile    pending
  ...
```

4. Confirm the target phase, then start executing immediately.

## Step 3 — Execute only the target phase

For every step that belongs to the current phase:

1. Read the target file before editing (never edit without reading first)
2. Apply changes exactly as described in the plan
3. Follow conventions in `docs/project-conventions.md`
4. After each step report: `✓ Step X done`

**Rules:**

- Execute **only** steps that belong to the current phase — do not bleed into the next phase
- Do not add features beyond what the plan describes
- When the plan is ambiguous, choose the minimal solution that fits existing conventions

## Step 4 — Verify

After all steps in the phase are complete:

1. Run `npx tsc --noEmit` — fix all TypeScript errors
2. Run `npx expo lint` — fix all lint warnings
3. Check every verification item listed for this phase, mark `[x]` when satisfied

## Step 5 — Update tracking docs

1. Open `docs/track_pages_and_components.md`
2. Update status columns for all items completed in this phase
3. If a new coding pattern was introduced, add it to `docs/project-conventions.md`

## Step 6 — Mark phase as done in the plan file

In the plan file, mark the completed phase with a `✓` or status badge:

```markdown
## Phase 2 — App shell  ✓ done — 2026-05-02
```

Also update the checklist items in the phase (check off completed items).

## Step 7 — Pause and report

Print a summary:

```
✓ Phase N complete
  Files modified: <list>
  Steps done: X

Remaining phases:
  Phase N+1 — <name>   (pending)
  Phase N+2 — <name>   (pending)

Run `/eksekusi-plan-by-phase docs/plans/<name>.md phase:<N+1>` to continue.
```

Do NOT automatically continue to the next phase — always pause here and wait for the user.
