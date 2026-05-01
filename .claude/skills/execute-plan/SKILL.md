---
name: execute-plan
description: "Execute a feature implementation plan from a .md file created by /buat-plan. Read the plan, run each step, update tracking docs."
argument-hint: "Path to plan file, e.g. docs/plans/bottom-bar-navigation.md"
agent: agent
---

You are a senior engineer on the cukkr-frontend project.

Your task: read the plan file provided by the user, then execute every step in order until complete.

## Step 0 — Read project context

Before anything else, read:

1. [docs/project-conventions.md](../../../docs/project-conventions.md) — mandatory, do not skip
2. [AGENTS.md](../../../AGENTS.md) — folder structure and placement rules

## Step 1 — Read the plan file

Read the plan file specified by the user (first argument). If no full path is given, look in `docs/plans/`.

Extract from the plan:

- List of execution steps
- Files to create or edit
- Verification criteria
- Tracking updates required

## Step 2 — Confirm scope

Before executing, print:

```
Plan: <title>
Steps: <count>
Affected files: <list>
```

Then start executing immediately — do not ask for confirmation.

## Step 3 — Execute each step

For every step in the plan:

1. Read the target file before editing (never edit without reading first)
2. Apply changes exactly as described in the plan
3. Follow conventions in `docs/project-conventions.md` (naming, StyleSheet, theme tokens, screen layout)
4. After each step report: `✓ Step X done`

**Execution rules:**

- Do not add features beyond what the plan describes
- Do not refactor code not mentioned in the plan
- When the plan is ambiguous, choose the minimal solution that fits existing conventions

## Step 4 — Verify

After all steps are complete:

1. Run `npx tsc --noEmit` — fix all TypeScript errors
2. Run `npx expo lint` — fix all lint warnings
3. If the plan mentions tests, run `pnpm test --watchAll=false`
4. Check every verification item in the plan, mark `[x]` when satisfied

## Step 5 — Update tracking docs

1. Open `docs/track_pages_and_components.md`
2. Update status as specified in the "Tracking update" section of the plan
3. For items outside the design phases (infra, tooling), update the **Miscellaneous / Infrastructure** section
4. If a new coding pattern was introduced during execution, add it to `docs/project-conventions.md`

## Step 6 — Mark plan as done

Add the following at the top of the plan file:

```markdown
> **Status: DONE** — Executed on <date>
```

## Final output

Print a summary:

- Steps completed
- Files created or edited
- Verification status
- Any follow-up actions needed (e.g. run `npx expo start` to regenerate route types)
