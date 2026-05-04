---
name: functional-implementation
description: "Wire state management, API calls, form validation, layout fixes, navigation flows, and optional tests for sliced pages/components in cukkr-frontend. Use this skill when pages are visually complete but not yet functional. Reads context, creates an execution plan, implements, and updates docs/track_pages_and_components.md."
argument-hint: "Describe any feature to implement — new screen, API integration, infra change, etc. Leave empty to auto-detect next unfinished phase."
---

# Functional Implementation

## Objective

Implement any feature end-to-end: state management, API integration, navigation flows, form validation, new screens, infrastructure changes, or any combination. This skill is **self-contained** — it reads context, builds an internal execution plan, implements, verifies, and updates tracking docs in one pass.

## Scope

This skill handles **anything**:

- New feature screens (slicing + wiring combined if needed)
- API service layer (`src/features/<feature>/services/`)
- Form validation (field rules, error messages, inline feedback)
- Navigation flows (route params, conditional redirects, deep links)
- Loading and error states (skeleton, spinner, error banners)
- Infrastructure changes (global components, layout wiring, env flags, etc.)
- State management (local `useState`/`useReducer`, global store if present)
- Unit and integration tests
- Updating tracking docs

## Main Rules

- **Read code before writing** — always read existing files before modifying them.
- **No over-engineering** — do not add abstraction layers not directly required.
- **Preserve existing UI** — do not remove or restructure sliced elements; only add behavior.
- **Service layer separation** — business logic and API calls go in `src/features/<feature>/services/`, not inside screen components.
- **Check before creating** — check if a service or utility already exists before making a new one.
- **Update tracking immediately** — mark `[x]` in the appropriate column right after finishing each item.

---

## Procedure

### Step 0 — Read project context (always first)

1. Read `docs/project-conventions.md` — theme tokens, component patterns, naming rules, test setup, file placement.
2. Read `AGENTS.md` — project structure and feature module layout.

### Step 1 — Read context

1. Read `docs/track_pages_and_components.md`.
2. Understand the target: use the user's argument if provided; otherwise find the first phase with unfinished items.
3. For each target item, read:
   - The screen or component file
   - Any existing service file in `src/features/<feature>/services/`
   - Global shared services in `src/services/` if relevant
4. Check `package.json` for installed libraries.
5. Summarize: what already exists, what is missing, what patterns the project uses.

### Step 2 — Build execution plan

Before touching any file, produce a short internal plan:

```
Feature / Phase: <name>
Items to implement: <list>

For each item:
  - What to build: <description>
  - State needed: <local / global / none>
  - API calls: <endpoint or "none">
  - Validation rules: <field rules or "none">
  - Navigation: <target route or "none">
  - Loading/error states: <yes / no>
  - Tests: <yes / no>
  - New files: <list or "none">
  - Files to modify: <list>
```

Show the plan. If the user gave a specific task, proceed automatically. Otherwise confirm.

### Step 3 — Implement one item at a time

#### 3a — Service layer (if API calls are needed)

1. Check if `src/features/<feature>/services/` exists; create it if not.
2. Create or update `<feature>-service.ts`.
3. Use `fetch` or the project's existing HTTP client — do not introduce a new HTTP library unless asked.
4. Export typed functions: `loginUser(payload)`, `fetchBarbers()`, etc.
5. Return a discriminated union or throw a typed error consistent with existing services.

#### 3b — Screen / component wiring

1. Read the current file in full.
2. Add `useState`/`useReducer` hooks for fields, loading, error, and UI state.
3. Connect submit handlers to service functions.
4. Display validation errors inline under each field.
5. Show loading indicators on primary action buttons.
6. Handle navigation on success using `router.push` / `router.replace`.
7. Handle API errors with a toast, alert, or inline message matching the design.

#### 3c — Layout fixes

- Adjust `ScrollView`, `KeyboardAvoidingView`, or `SafeAreaView` only if required by new dynamic content.
- Do not change static spacing or colors unless broken.

#### 3d — Infrastructure / other changes

- Follow the same read-first, minimal-change discipline.
- Document any new global pattern in `docs/project-conventions.md`.

### Step 4 — Write tests (when requested or `Tests: yes` in plan)

Place test files next to the feature:

- Service: `src/features/<feature>/services/__tests__/<feature>-service.test.ts`
- Screen: `src/features/<feature>/screens/__tests__/<ScreenName>.test.tsx`

Guidelines:

- Mock service calls with `jest.mock` — no real network requests.
- Cover: happy path, validation error display, loading state, API error handling.
- Run `pnpm test --watchAll=false` before marking done.

### Step 5 — Update tracking docs

1. Update `docs/track_pages_and_components.md`: change `[]` → `[x]` in the appropriate column.
2. Note new service files in `implementation_notes`.
3. For infra/tooling items, update the **Miscellaneous / Infrastructure** section.
4. If a new coding pattern was introduced, add it to `docs/project-conventions.md`.

### Step 6 — Continue or stop

- Continue to the next item.
- After all items are complete, report a summary and **stop**.

### Step 7 — Quality check

1. Run `npx tsc --noEmit` — fix all TypeScript errors.
2. Run `npx expo lint` — fix all lint warnings.
3. Run `pnpm test --watchAll=false` if tests were written.

---

## Project Patterns

> **These are summaries. The authoritative source is `docs/project-conventions.md`. Always read that file first.**

### HTTP client

- No Axios or React Query by default; use native `fetch`.
- If `src/services/api.ts` or `http.ts` exists, use it.

### State management

- No global store by default; use `useState`/`useReducer` locally.
- If Zustand or another store exists, follow its existing slice patterns.

### Navigation

- `expo-router` typed router from `'expo-router'`.
- Route types generated after `npx expo start` once.

### Form validation

- No Zod/Yup by default; use simple inline validation functions.
- Keep validators in `src/features/<feature>/utils/<feature>-validators.ts`.

### Error display

- Follow the pattern already used in the sliced screen (inline text, modal, or banner).

---

## File References

- **Conventions (read first):** [docs/project-conventions.md](../../../docs/project-conventions.md)
- Tracking: [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md)
- Page descriptions: [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md)
- Project structure: [AGENTS.md](../../../AGENTS.md)
- UI functional skill (UI-only phase): [.claude/skills/ui-functional-implementation/SKILL.md](../ui-functional-implementation/SKILL.md)

This skill handles:

- State management (local `useState`/`useReducer`, global store if present)
- API service layer (`src/features/<feature>/services/`)
- Form validation (field rules, error messages, inline feedback)
- Navigation flows (route params, conditional redirects, deep links)
- Loading and error states (skeleton, spinner, error banners)
- Layout adjustments required to support dynamic content
- Unit and integration tests (jest-expo + @testing-library/react-native)
- Updating `functioning_api_implemented` in `docs/track_pages_and_components.md`

## Main Rules

- **One phase at a time** — do not start the next phase before finishing the current one.
- **Read code before writing** — always read the existing screen/component file before modifying it.
- **No over-engineering** — do not add abstraction layers or helpers that are not directly required.
- **Preserve slicing** — do not remove or restructure existing UI elements; only add behavior.
- **Service layer separation** — business logic and API calls go in `src/features/<feature>/services/`, not inside screen components.
- **Check if a service already exists** before creating one.
- **Checklist each completed item** — immediately update `[x]` in the `functioning_api_implemented` column in `docs/track_pages_and_components.md` after finishing a page/component.

---

## Procedure

### Step 0 — Read project context (always first)

1. Read `docs/project-conventions.md` — theme tokens, component patterns, naming rules, test setup, file placement.
2. Read `AGENTS.md` — project structure and feature module layout.

### Step 1 — Read context

Collect the minimum necessary context before writing any code.

1. Read `docs/track_pages_and_components.md`.
2. Find the first phase that has items where `slicing_implemented` is `[x]` but `functioning_api_implemented` is `[]`.
3. For each target item in that phase, read:
   - The screen file (`lokasi` column)
   - Any existing service file in `src/features/<feature>/services/`
   - Global shared services in `src/services/` if relevant
4. Check `package.json` for installed libraries (state management, HTTP client, validation, etc.).
5. Summarize findings: what is already wired, what is missing, what patterns the project uses.

### Step 2 — Create an execution plan

Before touching any file, produce a short plan for the phase:

```
Phase: <phase name>
Items to wire: <list>

For each item:
  - State needed: <local / global / none>
  - API calls: <endpoint or "none">
  - Validation rules: <field rules or "none">
  - Navigation: <target route or "none">
  - Loading/error states: <yes / no>
  - Tests: <yes / no>
  - New files: <list or "none">
  - Files to modify: <list>
```

Show the plan and confirm with the user (or proceed automatically if a specific phase was given).

### Step 3 — Implement one item at a time

For each item in the plan:

#### 3a — Service layer (if API calls are needed)

1. Check if `src/features/<feature>/services/` exists; create it if not.
2. Create or update the service file following the naming pattern `<feature>-service.ts`.
3. Use `fetch` or the project's existing HTTP client — do not introduce a new HTTP library unless asked.
4. Export typed functions: `loginUser(payload)`, `registerUser(payload)`, etc.
5. Return a discriminated union or throw a typed error — keep error handling consistent with existing services.

#### 3b — Screen wiring

1. Read the current screen file in full.
2. Add `useState`/`useReducer` hooks for form fields, loading, error, and any UI state.
3. Connect submit handlers to service functions.
4. Display validation errors inline under each field.
5. Show loading indicators on primary action buttons.
6. Handle navigation on success using `router.push` / `router.replace` with correct typed routes.
7. Handle API error responses: show a toast, alert, or inline message depending on design.

#### 3c — Layout fixes (if dynamic content breaks layout)

- Adjust `ScrollView`, `KeyboardAvoidingView`, or `SafeAreaView` wrapping only if required by the new dynamic content.
- Do not change static spacing or colors unless broken.

### Step 4 — Write tests (when requested or when `Tests: yes` in plan)

Place test files next to the feature:

- Service tests: `src/features/<feature>/services/__tests__/<feature>-service.test.ts`
- Screen tests: `src/features/<feature>/screens/__tests__/<ScreenName>.test.tsx`

#### Test guidelines

- Use `@testing-library/react-native` for screen tests.
- Mock service calls with `jest.mock` — do not make real network requests.
- Cover: happy path, validation error display, loading state, API error handling.
- Keep tests focused: one `describe` block per screen or service function.
- Run `pnpm test --watchAll=false` to verify tests pass before checking off the item.

### Step 5 — Checklist and update tracking

After completing an item:

1. Update `docs/track_pages_and_components.md`: change `[]` → `[x]` in `functioning_api_implemented`.
2. If new service files were created, note them in `implementation_notes` for that row.
3. If the item is outside the design phases (utility, global service, infra), add it to the **Miscellaneous / Infrastructure** section.
4. If a new coding pattern was introduced (HTTP error handling shape, validation pattern, etc.), add it to `docs/project-conventions.md`.

### Step 6 — Continue or stop

- Continue to the next item within the same phase.
- After all items in the phase are complete, report a summary and **stop** — do not automatically start the next phase.

### Step 7 — Quality check and git commit

1. Run `npx tsc --noEmit` — fix all TypeScript errors before committing.
2. Run `npx expo lint` — fix all lint warnings.
3. Run `pnpm test --watchAll=false` if tests were written.
4. Commit with a clear message:
   - `feat: wire <feature> login and register API integration`
   - `test: add unit tests for auth service`
5. Push to `origin dev`.

---

## Project Patterns

> **These are summaries. The authoritative source is `docs/project-conventions.md`. Always read that file first.**

### HTTP client

- No Axios or React Query installed by default; use native `fetch`.
- If the project has a custom `src/services/api.ts` or `http.ts`, use it.

### State management

- No global store installed by default; use local `useState`/`useReducer`.
- If Zustand or another store is added later, follow its existing slice patterns.

### Navigation

- Use `expo-router`'s typed `router` from `'expo-router'`.
- Route types are generated after running `npx expo start` once (see AGENTS.md).

### Form validation

- No Zod or Yup installed by default; use simple inline validation functions.
- Keep validators in `src/features/<feature>/utils/<feature>-validators.ts`.

### Error display

- Follow the pattern already used in the sliced screen (inline text, modal, or banner).

### Tests

- `jest-expo` preset is configured in `package.json`.
- `@testing-library/react-native` is installed.
- Run with `pnpm test --watchAll=false`.

---

## File References

- **Conventions (read first):** [docs/project-conventions.md](../../../docs/project-conventions.md)
- Tracking: [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md)
- Page descriptions: [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md)
- Project structure: [AGENTS.md](../../../AGENTS.md)
- Slicing skill (reference): [.claude/skills/slicing-implementation/SKILL.md](../slicing-implementation/SKILL.md)
- UI functional skill (prior phase): [.claude/skills/ui-functional-implementation/SKILL.md](../ui-functional-implementation/SKILL.md)
