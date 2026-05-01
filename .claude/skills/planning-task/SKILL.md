---
name: planning-task
description: "Create a feature implementation plan in a .md file. Use before execution. Reads full project context then produces a step-by-step plan (single-phase or multi-phase) that can be executed with /eksekusi-plan or /eksekusi-plan-by-phase."
argument-hint: "Describe the feature to implement. Add 'multi-phase' if the work spans multiple independent phases."
agent: agent
---

You are a senior engineer on the cukkr-frontend project.

Your task: read the project context thoroughly, analyse the user's request, then produce a **plan file** under `docs/plans/` containing concrete, specific, LLM-executable steps.

## Step 1 — Read project context

Read the following files before anything else:

1. [docs/project-conventions.md](../../../docs/project-conventions.md) — theme tokens, naming, component patterns, screen layout, navigation
2. [AGENTS.md](../../../AGENTS.md) — folder structure, placement rules
3. [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md) — implementation status of all pages and components
4. [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md) — UI/UX intent per page

If the request mentions a specific page or component, also read its implementation file.

## Step 2 — Analyse the request

Determine:

- **Scope**: which pages, which components are affected
- **Multi-phase?**: Does the work naturally split into independent phases (e.g. by feature area, dependency order, or screen group)? If yes, plan with phases.
- **Phase type per phase**: slicing / ui-functional / api-integration / infra
- **Files to create or edit** (concrete list)
- **Dependencies**: any component that must exist first?
- **Risk**: possible breaking changes?

**When to use phases:**
- Work spans multiple feature areas (auth, home, schedule, etc.)
- Later phases depend on earlier ones (e.g. components must exist before screens use them)
- The full plan is too large to execute safely in one run (>10 files)
- The user explicitly asks for phases

## Step 3 — Create the plan file

Create a new file at `docs/plans/<feature-name-kebab-case>.md`.

### If single-phase (simple, focused work):

Use this format:

```markdown
# Plan: <Feature Title>

## Goal

<One paragraph — what to achieve and why>

## Scope

- Phase: <slicing | ui-functional | api-integration | infra>
- Affected pages/components: <list>

## Analysis

<Summary of findings from reading existing code — what state already exists, what is missing, what patterns are in use>

## Files to create / edit

| File             | Action        | Notes             |
| ---------------- | ------------- | ----------------- |
| path/to/file.tsx | create / edit | brief explanation |

## Execution steps

### Step 1 — <step title>

**File:** `path/to/file.tsx`  
**Action:** <edit / create>  
**Details:**

- <concrete bullet — what exactly to do>
- <mention variable names, function names, props when relevant>

### Step 2 — ...

## Verification

- [ ] <how to manually verify the feature works>
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint warnings (`npx expo lint`)

## Tracking update

- Tracking file: `docs/track_pages_and_components.md`
- Section: <Phase X / Miscellaneous>
- Columns/rows to update: <which column, which row>

## Notes

<Edge cases, gotchas, or anything to watch out for>
```

---

### If multi-phase (large scope, multiple feature areas, or explicit request):

Use this format:

```markdown
# Plan: <Feature Title>

## Goal

<One paragraph — what to achieve and why>

## Phases Overview

| Phase | Name | Type | Scope summary | Status |
|-------|------|------|---------------|--------|
| 1 | <name> | <slicing/ui-functional/...> | <brief> | pending |
| 2 | <name> | <type> | <brief> | pending |
| 3 | <name> | <type> | <brief> | pending |

> Execute with `/eksekusi-plan-by-phase docs/plans/<name>.md`
> To run a specific phase: `/eksekusi-plan-by-phase docs/plans/<name>.md phase:2`

---

## Phase 1 — <Phase Name>

### Goal
<What this phase achieves>

### Affected files

| File | Action | Notes |
|------|--------|-------|
| path/to/file.tsx | create / edit | brief |

### Steps

#### Step 1.1 — <title>

**File:** `path/to/file.tsx`  
**Action:** edit / create  
**Details:**
- <concrete bullet>

#### Step 1.2 — ...

### Verification
- [ ] <phase-specific check>
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint warnings (`npx expo lint`)

### Tracking update
- Section: <Phase X>
- Rows to update: <which rows, which columns>

---

## Phase 2 — <Phase Name>

### Goal
<What this phase achieves — note any dependency on Phase 1>

### Affected files
...

### Steps
...

### Verification
...

### Tracking update
...

---

## Notes

<Cross-phase gotchas, ordering constraints, shared dependencies>
```

## Step 4 — Validate the plan

After creating the plan file, quick-check:

- Do all referenced files already exist in the workspace? If not, mark them as "CREATE".
- Are the steps in dependency order with no unmet prerequisites?
- Are there new patterns not yet in `docs/project-conventions.md`? If so, note them in the plan.

## Output

## Output

When done:

1. Show the path of the created plan file
2. Print a summary: phase count (or step count if single-phase), affected files, complexity estimate (simple / medium / complex)
3. Tell the user:
   - Single-phase: "Run `/eksekusi-plan docs/plans/<name>.md` to start execution."
   - Multi-phase: "Run `/eksekusi-plan-by-phase docs/plans/<name>.md` to execute phase by phase."
