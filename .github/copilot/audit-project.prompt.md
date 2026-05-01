---
name: audit-project
description: "Audit and evaluate the cukkr-frontend project for stability, code quality, and convention compliance. Run this periodically to keep the codebase clean."
applyTo: "**"
---

You are a senior engineer auditing the cukkr-frontend project.

Your goal: produce a structured audit report that surfaces real problems, violations, and risks — with concrete fix recommendations for each finding.

---

## Step 1 — Read project context

Before auditing, read these files:

1. `docs/project-conventions.md` — theme tokens, naming, component patterns, screen layout, navigation rules
2. `docs/project-structure.md` — full directory tree and tech stack
3. `AGENTS.md` — folder placement rules
4. `docs/track_pages_and_components.md` — implementation status of all pages and components

---

## Step 2 — Run automated checks

Run the following commands and capture all output:

```bash
# Type check
npx tsc --noEmit 2>&1

# Lint
pnpm lint 2>&1

# Tests
pnpm test --watchAll=false 2>&1
```

Record all errors, warnings, and test failures verbatim.

---

## Step 3 — Convention audit

For each category below, scan the relevant files and report violations.

### 3.1 File placement

- `app/(scope)/page.tsx` files must be thin — only import + `export default` mounting a screen. Flag any with business logic, state, or JSX beyond a single component mount.
- Business logic and state must live in `src/features/<feature>/screens/`, never in `app/`.
- Components used in only one feature must be in `src/features/<feature>/components/`, not `src/components/`.
- Components used across 2+ features must be in `src/components/`, not inside a single feature.

### 3.2 Theme token compliance

- No hardcoded hex color strings (e.g. `'#1A1A1A'`, `'#EEEEE0'`) — must reference `AppTheme.colors.*` or the feature theme.
- No magic spacing numbers (e.g. `padding: 16`) — must reference `AppTheme.spacing.*`.
- No magic border radius numbers — must reference `AppTheme.borderRadius.*`.
- Feature-scoped themes (auth, onboarding) must only be used inside their own feature folders.

### 3.3 Component patterns

- All components in `src/` must use **named exports**, not `export default`.
- All route files in `app/` must use `export default`.
- Props must use `interface`, not `type alias`.
- All style objects must use `StyleSheet.create(...)`. Flag inline style objects in JSX (except dynamic values from props).
- Styles must be composed with arrays when combining static + conditional styles: `style={[styles.x, condition && styles.y]}`.

### 3.4 Screen layout rules

- `SafeAreaView` must be the outermost wrapper on every screen.
- `ScrollView` must use `contentContainerStyle={{ flexGrow: 1 }}`, never `flex: 1` inside `contentContainerStyle`.
- Sticky CTAs and bottom tab bars must sit outside any `ScrollView`, inside `SafeAreaView`.
- `KeyboardAvoidingView` must only be present on screens with text inputs.

### 3.5 Navigation patterns

- Navigation must use `useRouter()` from `expo-router`.
- `router.replace` must be used for post-auth redirects and splash transitions.
- `router.back()` must be used in header back buttons.
- Shared components must never navigate internally — navigation must be passed as `onPress` callbacks.

### 3.6 State management

- No global state store usage beyond Zustand (already used in onboarding) unless documented in `docs/project-conventions.md`.
- No business logic inside shared components — logic belongs in screen files.

### 3.7 Naming conventions

| Item               | Expected convention     |
| ------------------ | ----------------------- |
| Component file     | `PascalCase.tsx`        |
| Screen file        | `PascalCaseScreen.tsx`  |
| Feature theme      | `kebab-case-theme.ts`   |
| Feature service    | `kebab-case-service.ts` |
| Route file         | `kebab-case.tsx`        |
| Mock data constant | `SCREAMING_SNAKE_CASE`  |

Flag any files not matching their expected convention.

### 3.8 Icons

- All icons must use `@expo/vector-icons` — prefer `Ionicons`.
- Flag any raw emoji, Unicode symbols, or other icon libraries used as icons.

---

## Step 4 — Dead code and consistency check

- Identify exported functions, components, or files that are never imported anywhere.
- Identify duplicate logic (same util or helper written more than once across features).
- Identify `TODO`, `FIXME`, `HACK`, or `@ts-ignore` / `// eslint-disable` comments that are unresolved.
- Identify `console.log` / `console.error` calls left in production-bound code.

---

## Step 5 — Tracking doc sync check

Read `docs/track_pages_and_components.md` and cross-reference against the actual files in `app/` and `src/`:

- Are there pages in `app/` that are not listed in the tracking doc?
- Are there components in `src/components/` or `src/features/*/components/` not listed?
- Are any tracking entries pointing to files that no longer exist?
- Are `slicing_implemented` flags accurate — do the files actually exist?

---

## Step 6 — Security baseline check

- No API keys, secrets, or tokens hardcoded in any source file.
- No `dangerouslySetInnerHTML` or equivalent in web-targeted components.
- No `eval()` or dynamic `require()` calls.
- AsyncStorage values storing sensitive data should be noted for future encryption consideration.

---

## Step 7 — Produce the audit report

Output a structured report with these sections. Use a severity tag for each finding:

- 🔴 **Critical** — broken code, type errors, failed tests, security issues
- 🟡 **Warning** — convention violations, dead code, tracking doc mismatches
- 🟢 **Info** — minor style inconsistencies, improvement suggestions

### Report format

```
# cukkr-frontend Audit Report
Date: <today's date>

## Summary
- Critical: N
- Warning: N
- Info: N

## TypeScript / Lint / Test results
<paste output from Step 2>

## Findings

### [SEVERITY] Category: Short title
File: path/to/file.tsx (line N if applicable)
Issue: <what is wrong>
Fix: <concrete action to take>

---
```

After the report, provide a **Recommended fix order** — list the Critical items first, then Warning by impact.

If there are zero findings in a category, state "✅ No issues found."
