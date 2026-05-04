> **Status: DONE** — Executed on 2026-05-02

# Plan: Extract DevNavFloat to Standalone Component with Env Guard

## Goal

Extract the `DevNavFloat` component from its inline definition inside `app/_layout.tsx` into its own file at `src/components/DevNavFloat.tsx`, and add an environment-based visibility guard so the floating dev button only renders in non-production builds. Uses only built-in Expo/React Native mechanisms — no new libraries required.

## Scope

- Phase: infra
- Affected pages/components: `app/_layout.tsx`, `src/components/DevNavFloat.tsx` (new), `docs/track_pages_and_components.md`

## Analysis

- `DevNavFloat` is currently defined inline in `app/_layout.tsx` (lines 11–57) with no env guard — it renders unconditionally in every build.
- The component is a FAB (bottom-left, zIndex 999) that opens a `Modal` overlay with two menu items: "Manage Halaman" (`router.push("/dev-nav")`) and "Tutup" (close).
- All styles are inline in the same file via `StyleSheet.create`.
- Expo provides two built-in mechanisms for env control without extra libraries:
  1. `__DEV__` — React Native global boolean; `true` in Expo Go and debug builds, `false` in production builds (`eas build --profile production`).
  2. `EXPO_PUBLIC_*` — variables with this prefix are inlined at build time and accessible via `process.env.EXPO_PUBLIC_*`.
- Best practice: use `__DEV__` as the primary guard. Optionally support `EXPO_PUBLIC_SHOW_DEV_TOOLS=true` to force-show in non-dev builds (e.g., internal distribution builds).
- The existing `.env` file uses `ENV_CODE=development` without `EXPO_PUBLIC_` prefix — it's not accessible from the RN bundle. A new `.env` variable with the correct prefix should be documented.
- `FloatingActionButton.tsx` already exists in `src/components/` but is a different generic component (Ionicons "send" icon, bottom-right) — no conflict.

## Files to create / edit

| File                                 | Action | Notes                                                                 |
| ------------------------------------ | ------ | --------------------------------------------------------------------- |
| `src/components/DevNavFloat.tsx`     | CREATE | Full component extraction + env visibility guard                      |
| `app/_layout.tsx`                    | EDIT   | Remove inline `DevNavFloat` definition; import from `src/components/` |
| `docs/track_pages_and_components.md` | EDIT   | Update DevNavFloat row in Miscellaneous section with new lokasi       |

## Execution steps

### Step 1 — Create `src/components/DevNavFloat.tsx`

**File:** `src/components/DevNavFloat.tsx`  
**Action:** create

**Details:**

- Copy the full `DevNavFloat` component body and its `StyleSheet.create` styles from `app/_layout.tsx`.
- Add the env visibility guard at the top of the component body (before the `useState` hook setup):
  ```ts
  const isVisible =
    __DEV__ || process.env.EXPO_PUBLIC_SHOW_DEV_TOOLS === "true";
  if (!isVisible) return null;
  ```
- Add necessary imports: `{ useState }` from `"react"`, `{ useRouter }` from `"expo-router"`, RN primitives, and declare `declare const __DEV__: boolean;` is **not** needed — `__DEV__` is a global in React Native/Expo and TypeScript already knows about it via `@types/react-native`.
- Export as named export: `export function DevNavFloat() { ... }`
- Move the entire `StyleSheet.create({ ... })` block for `fab`, `fabIcon`, `overlay`, `card`, `cardTitle`, `menuItem`, `menuItemText`, `cancelItem`, `cancelText` into this file.

### Step 2 — Update `app/_layout.tsx`

**File:** `app/_layout.tsx`  
**Action:** edit

**Details:**

- Add import at the top: `import { DevNavFloat } from "@/src/components/DevNavFloat";`
- Remove the entire inline `function DevNavFloat() { ... }` definition (lines 11–57 in current file).
- Remove the `useState` import if it is no longer used by `_layout.tsx` itself (currently `useState` is only used by `DevNavFloat`).
- Remove the `Modal`, `TouchableWithoutFeedback` imports if they are only used by `DevNavFloat` (verify — they are).
- The `<DevNavFloat />` usage inside `RootLayout` stays unchanged.
- The `StyleSheet` import stays only if `styles` is still used in `_layout.tsx` — currently all styles belong to `DevNavFloat`, so remove `StyleSheet` import and the entire `const styles = StyleSheet.create({...})` block from `_layout.tsx`.
- After cleanup, `_layout.tsx` imports should be: `Stack, useRouter` from `expo-router` → actually `useRouter` is also only used inside DevNavFloat, so remove it too. Final imports for `_layout.tsx`: `Stack` from `"expo-router"`, `View` from `"react-native"`, `DevNavFloat` from `"@/src/components/DevNavFloat"`.

### Step 3 — Update `docs/track_pages_and_components.md`

**File:** `docs/track_pages_and_components.md`  
**Action:** edit

**Details:**

- Find the Miscellaneous table row for `DevNavFloat`.
- Update the `lokasi` column from `app/_layout.tsx (DevNavFloat component)` to `src/components/DevNavFloat.tsx`.
- Update the `implementation_notes` column to reflect: "Extracted to standalone component; visibility guard uses `__DEV__ || EXPO_PUBLIC_SHOW_DEV_TOOLS === 'true'`; hidden in production builds."

## Verification

- [ ] Run app in Expo Go / dev build — floating dev button still appears bottom-left and opens the modal correctly
- [ ] Click "Manage Halaman" — navigates to `/dev-nav`
- [ ] Click "Tutup" — modal closes
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint warnings (`npx expo lint`)
- [ ] (Optional) Set `EXPO_PUBLIC_SHOW_DEV_TOOLS=false` in `.env` and confirm button is hidden when `__DEV__` is also false (simulate by temporarily returning `false` for `__DEV__` or checking production build behavior)

## Tracking update

- Tracking file: `docs/track_pages_and_components.md`
- Section: Miscellaneous / Infrastructure
- Row to update: `DevNavFloat` — change `lokasi` column and `implementation_notes` column

## Notes

- `__DEV__` is `true` in Expo Go, `expo start` dev server, and debug builds. It is `false` in production EAS builds. This is the simplest correct guard.
- `EXPO_PUBLIC_SHOW_DEV_TOOLS` must be prefixed with `EXPO_PUBLIC_` to be bundled into the app. Variables without this prefix (like the existing `ENV_CODE`) are **not** accessible from RN code.
- To use the env override: add `EXPO_PUBLIC_SHOW_DEV_TOOLS=true` to `.env` (or `.env.development`) for dev convenience, or leave it unset in `.env.production`.
- TypeScript: `process.env.EXPO_PUBLIC_SHOW_DEV_TOOLS` is typed as `string | undefined` — the `=== 'true'` check handles the `undefined` case correctly.
- No new npm packages needed. `expo-constants` is available but unnecessary here — `__DEV__` and `EXPO_PUBLIC_*` are sufficient.
