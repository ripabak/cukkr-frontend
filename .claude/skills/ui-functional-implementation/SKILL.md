---
name: ui-functional-implementation
description: "Make already-sliced pages and components interactive without API integration. Covers navigation wiring, bottom tab bar, screen headers, modals, tabs, toggles, form field behavior, scroll/keyboard layout, mock data rendering, and UI tests. Use this skill after slicing is done but before API integration."
argument-hint: "Specify a phase, page, or component to make interactive. Leave empty to auto-detect the next unfinished items from track_pages_and_components.md."
---

# UI Functional Implementation

## Objective

Make sliced (static) pages and components truly interactive using local state, navigation, and mock data — without touching any real API or backend integration.

This skill is **self-contained**: it reads context, builds an internal execution plan, implements, verifies, and updates tracking docs in one pass.

## Scope

This skill handles:

| Category                     | Examples                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Navigation wiring**        | BottomTabBar → expo-router tabs, ScreenHeader back button, wizard step routing, conditional redirects |
| **Interactive UI state**     | Modal open/close, segmented tab switching, accordion expand/collapse, sort/filter menu toggle         |
| **Form field behavior**      | Focus order, `KeyboardAvoidingView`, field validation display (local rules only), input masking       |
| **Toggle & switch controls** | `ToggleSwitch` state with local `useState`, `ToggleRow` callback prop wiring                          |
| **Picker overlays**          | `CalendarModal` date selection, `TimePickerModal` wheel, `SortMenu`, `OverflowMenu`                   |
| **List rendering**           | `FlatList`/`ScrollView` with static mock data, empty states, loading skeletons (placeholder)          |
| **Layout correctness**       | `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView` with `contentContainerStyle`                     |
| **Selection mode**           | Multi-select toggle, `SelectionToolbar`, `SelectionFooter`, `FloatingActionButton` visibility         |
| **Swipe gestures**           | `SwipeConfirmationModal` gesture handler binding                                                      |
| **UI tests**                 | Render, interaction, and state transition tests — no real network mocks needed                        |

## Out of Scope

- Real API calls or `fetch`/`axios` integration
- Auth token storage or refresh logic
- Backend-driven data (use static mock objects instead)
- `functioning_api_implemented` column — do **not** touch it here

---

## Main Rules

- **Read first, then write** — always read the screen/component file in full before modifying it.
- **Preserve slicing** — do not remove, rename, or re-style existing UI elements; only add interactive behavior.
- **No over-engineering** — use `useState`/`useReducer` locally; do not introduce global stores unless one already exists.
- **Mock data is fine** — define a typed `MOCK_DATA` constant at the top of the screen file. Keep it minimal (2–5 items).
- **One item at a time** — finish and verify each screen or component before moving to the next.

---

## Procedure

### Step 0 — Read project context (always first)

1. Read `docs/project-conventions.md` — theme tokens, component patterns, naming rules, screen layout rules, test setup.
2. Read `AGENTS.md` — project structure and file placement rules.

### Step 1 — Read context

1. Read `docs/track_pages_and_components.md`.
2. Identify the target: use the argument if provided; otherwise find the first phase with `slicing_implemented: [x]` items that still have no `ui_functional_implemented` entry.
3. For each target item, read:
   - The screen/component file (`lokasi` column)
   - The `implementation_notes` column for known quirks
   - The PNG reference for items involving overlays, modals, or complex interactions
4. Check `package.json` for gesture libraries and icon sets.

### Step 2 — Build execution plan

Before touching any file, write a short internal plan:

```
Phase: <phase name>
Target items: <list>

For each item:
  - Interactions to wire: <list>
  - Mock data needed: <entity type or "none">
  - Tests: <yes / no>
  - New files: <list or "none">
  - Files to modify: <list>
```

Show the plan. If a specific item was given in the argument, proceed automatically. Otherwise confirm with the user.

### Step 3 — Implement one item at a time

#### 3a — Navigation wiring

- Use `useRouter()` or `<Link>` for all navigation.
- `BottomTabBar`: `router.push` / `router.replace` on each tab press; derive `activeTab` from `usePathname()` or a prop.
- `ScreenHeader` back: `router.back()` unless root screen, then `router.replace('/')`.
- Wizard steps: wire each CTA to `router.push` the next step route.
- Modals inside a screen: use local `useState<boolean>` — do not navigate.

#### 3b — Interactive UI state

- Each toggle, tab, sort menu, overflow menu, and accordion needs its own `useState`.
- Pass callback props (`onToggle`, `onSelect`, `onClose`) down to shared components — do not add logic inside shared components.
- `SegmentedTabs`: maintain `activeTab` in the screen, pass as prop, render correct sub-view.

#### 3c — Form field behavior

- Wrap fields in `KeyboardAvoidingView behavior="padding"` (iOS) / `behavior="height"` (Android) if not present.
- Add `returnKeyType` and `onSubmitEditing` to advance focus using `useRef<TextInput>`.
- Inline error `Text` below each field driven by a local validator in `src/features/<feature>/utils/<feature>-validators.ts`.
- Validators must be pure functions — no API calls.

#### 3d — List rendering with mock data

- Define `const MOCK_<ENTITY>: <Type>[] = [...]` at the top of the file.
- Use `FlatList` with `keyExtractor` and typed `renderItem`.
- Add empty state component when the list is empty.
- For search screens, filter in-memory using `searchQuery` state and `.filter()`.

#### 3e — Layout correctness

- Every screen: `<SafeAreaView style={{ flex: 1 }}>` unless root layout provides it.
- Scrollable content: `<ScrollView contentContainerStyle={{ flexGrow: 1 }}>`.
- Fixed bottom bar or sticky CTA: use absolute positioning or a separate `<View>` **outside** the `ScrollView`.

#### 3f — Picker and modal overlays

- `CalendarModal`, `TimePickerModal`, `ConfirmationModal`, etc.: manage open/close with local state; pass `visible` and `onClose` as props.
- `SwipeConfirmationModal`: bind `PanGestureHandler` to drive swipe-to-confirm with `Animated.Value`.

### Step 4 — Write tests (when `Tests: yes` in plan)

Place test files in:

- `src/features/<feature>/screens/__tests__/<ScreenName>.test.tsx`
- `src/components/__tests__/<ComponentName>.test.tsx`

| Scenario                           | How                                                              |
| ---------------------------------- | ---------------------------------------------------------------- |
| Renders without crash              | `render(<Component />)`                                          |
| Tab/toggle changes on press        | `fireEvent.press(...)` + assertion                               |
| Modal opens and closes             | press CTA → expect visible; press close → expect hidden          |
| Navigation called on CTA           | mock `useRouter`; assert `router.push` called with correct route |
| Empty list shows empty state       | render with empty mock array                                     |
| Search filter reduces list         | type into `SearchInput`, assert fewer items                      |
| Form shows error on invalid submit | fill invalid value + press submit → `getByText('error')`         |

```ts
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  usePathname: () => "/",
  Link: ({ children }: any) => children,
}));
```

Run `pnpm test --watchAll=false` before marking done.

### Step 5 — Update tracking docs

1. Open `docs/track_pages_and_components.md`.
2. If `ui_functional_implemented` column does not exist, add it after `slicing_implemented`.
3. Change `[]` → `[x]` for the completed item.
4. Update `implementation_notes` with key decisions.
5. If the item is infra/tooling, add it to the **Miscellaneous / Infrastructure** section.
6. If a new coding pattern was introduced, add it to `docs/project-conventions.md`.

### Step 6 — Continue or stop

- Continue to the next item within the same phase.
- After all items in the phase are done, report a summary and **stop**. Do not auto-start the next phase.

### Step 7 — Quality check

1. Run `npx tsc --noEmit` — fix all TypeScript errors.
2. Run `npx expo lint` — fix all warnings.
3. Run `pnpm test --watchAll=false` if tests were written.

---

## Project Patterns

> **These are summaries. The authoritative source is `docs/project-conventions.md`. Always read that file first.**

### Navigation

- `expo-router` typed router; use `router.push`, `router.replace`, `router.back()`.
- Route types are auto-generated after `npx expo start`. See AGENTS.md.

### State

- No global store by default. Use `useState`/`useReducer` locally.

### Gestures

- `react-native-gesture-handler` and `react-native-reanimated` are installed.

### Icons

- Use `@expo/vector-icons` (Ionicons preferred).

---

## File References

- **Conventions (read first):** [docs/project-conventions.md](../../../docs/project-conventions.md)
- Tracking: [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md)
- Page descriptions: [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md)
- Project structure: [AGENTS.md](../../../AGENTS.md)
- API integration skill (next phase): [.claude/skills/functional-implementation/SKILL.md](../functional-implementation/SKILL.md)

This skill handles:

| Category                     | Examples                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Navigation wiring**        | BottomTabBar → expo-router tabs, ScreenHeader back button, wizard step routing, conditional redirects                  |
| **Interactive UI state**     | Modal open/close, segmented tab switching, accordion expand/collapse, sort/filter menu toggle                          |
| **Form field behavior**      | Focus order, `KeyboardAvoidingView`, field validation display (local rules only), input masking                        |
| **Toggle & switch controls** | `ToggleSwitch` state with local `useState`, `ToggleRow` callback prop wiring                                           |
| **Picker overlays**          | `CalendarModal` date selection, `TimePickerModal` wheel, `SortMenu`, `OverflowMenu`                                    |
| **List rendering**           | `FlatList`/`ScrollView` with static mock data, empty states, loading skeletons (placeholder)                           |
| **Layout correctness**       | `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView` with `contentContainerStyle`, dynamic content not breaking layout |
| **Selection mode**           | Multi-select toggle, `SelectionToolbar`, `SelectionFooter`, `FloatingActionButton` visibility                          |
| **Swipe gestures**           | `SwipeConfirmationModal` gesture handler binding                                                                       |
| **UI tests**                 | Render, interaction, and state transition tests — no real network mocks needed                                         |

## Out of Scope (for this skill)

- Real API calls or `fetch`/`axios` integration
- Auth token storage or refresh logic
- Backend-driven data (replace with static mock objects)
- `functioning_api_implemented` column — do **not** check it here; that is the API integration phase

---

## Main Rules

- **Read first, then write** — always read the screen/component file in full before modifying it.
- **Preserve slicing** — do not remove, rename, or re-style existing UI elements; only add interactive behavior.
- **No over-engineering** — use `useState`/`useReducer` locally; do not introduce global stores unless one already exists.
- **Mock data is fine** — for list screens, define a typed `MOCK_DATA` constant at the top of the screen file. Keep it minimal (2–5 items).
- **One item at a time** — finish and verify each screen or component before moving to the next.
- **Checklist immediately** — after finishing an item, update `docs/track_pages_and_components.md` in the `ui_functional_implemented` column (add this column if it does not exist yet).

---

## Procedure

### Step 0 — Read project context (always first)

1. Read `docs/project-conventions.md` — theme tokens, component patterns, naming rules, screen layout rules, test setup.
2. Read `AGENTS.md` — project structure and file placement rules.

### Step 1 — Read context

1. Read `docs/track_pages_and_components.md`.
2. Identify the target phase (first phase with `slicing_implemented: [x]` items that still have no UI functional work noted).
3. For each target item, read:
   - The screen file at `lokasi`
   - Any related component files listed under `dependency`
   - The `implementation_notes` column for known quirks
4. Read the PNG reference (`lokasi_referensi_png`) for any item that involves an overlay, modal, picker, or complex interaction.
5. Check `package.json` for gesture libraries (`react-native-gesture-handler`, `react-native-reanimated`) and icon sets.
6. Summarize: what interactions are missing, what already works, what mock data is needed.

### Step 2 — Build the execution plan

Before touching any file, write a short plan:

```
Phase: <phase name>
Target items: <list>

For each item:
  - Missing interactions: <list>
  - Local state needed: <list of useState names and types>
  - Navigation targets: <route or "none">
  - Mock data needed: <yes / no — describe shape if yes>
  - Layout fixes: <describe or "none">
  - New component props needed: <describe or "none">
  - Tests: <yes / no>
  - Files to modify: <list>
  - New files: <list or "none">
```

Show the plan. If a phase or item was specified in the argument, proceed automatically. Otherwise confirm with the user.

### Step 3 — Implement one item at a time

Work through each item in order. For each item:

#### 3a — Navigation wiring

- Use `expo-router`'s `useRouter()` or `<Link>` for all navigation.
- For `BottomTabBar`: call `router.push` / `router.replace` with the correct route string on each tab press; derive `activeTab` from `usePathname()` or a prop passed by the parent screen.
- For `ScreenHeader` back button: use `router.back()` unless the screen is a root; then use `router.replace('/')`.
- For wizard steps: wire each CTA to `router.push` the next step route.
- For modals inside a screen: use local `useState<boolean>` — do not navigate.

#### 3b — Interactive UI state

- Each toggle, tab, sort menu, overflow menu, and accordion needs its own `useState`.
- Pass callback props (`onToggle`, `onSelect`, `onClose`) down to shared components — do not add logic inside shared components themselves.
- For `SegmentedTabs`: maintain `activeTab` state in the screen, pass it as a prop, and render the correct sub-view.
- For `OverflowMenu` / `SortMenu`: maintain a `menuVisible` boolean state; position the menu using `Animated` or absolute layout as already done in the sliced version.

#### 3c — Form field behavior

- Wrap fields in `KeyboardAvoidingView` with `behavior="padding"` (iOS) or `behavior="height"` (Android) if not already present.
- Add `returnKeyType` and `onSubmitEditing` to advance focus to the next field using `useRef<TextInput>`.
- Add inline error `Text` below each field driven by a local validation function in `src/features/<feature>/utils/<feature>-validators.ts`.
- Validators must be pure functions — no API calls. Example rules: required, email format, min length, numeric.

#### 3d — List rendering with mock data

- Define a `const MOCK_<ENTITY>: <Type>[] = [...]` constant at the top of the file.
- Use `FlatList` with `keyExtractor` and typed `renderItem`.
- Add an empty state component (center-aligned text or icon) when the list is empty.
- For search screens, filter `MOCK_<ENTITY>` in-memory using a local `searchQuery` state and `.filter()`.

#### 3e — Layout correctness

- Every screen must be wrapped in `<SafeAreaView style={{ flex: 1 }}>` unless the root layout already provides it.
- Scrollable content must use `<ScrollView contentContainerStyle={{ flexGrow: 1 }}>` — not `flex: 1` inside `contentContainerStyle`.
- For screens with a fixed bottom bar or sticky CTA, use absolute positioning or a separate `<View>` outside the `ScrollView`, not inside it.
- `BottomTabBar` or `StickyCta` at the bottom must sit outside any `ScrollView`.

#### 3f — Picker and modal overlays

- `CalendarModal`, `TimePickerModal`, `ConfirmationModal`, `AlertModal` etc.: manage open/close with local state; pass `visible` and `onClose` as props.
- For `SwipeConfirmationModal`: bind `react-native-gesture-handler`'s `PanGestureHandler` to drive a swipe-to-confirm interaction using `Animated.Value`.

### Step 4 — Write tests (when `Tests: yes` in plan)

Place test files in:

- `src/features/<feature>/screens/__tests__/<ScreenName>.test.tsx`
- `src/components/__tests__/<ComponentName>.test.tsx`

#### What to test

| Scenario                           | How                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Component renders without crashing | `render(<Component />)`                                                          |
| Tab/toggle state changes on press  | `fireEvent.press(...)` + `expect(...).toHaveStyle(...)` or `toBeVisible()`       |
| Modal opens and closes             | press CTA → expect modal visible; press close → expect hidden                    |
| Navigation is called on CTA press  | mock `expo-router`'s `useRouter`; assert `router.push` called with correct route |
| Empty list shows empty state       | render with empty mock array, check for empty-state element                      |
| Search filter reduces list         | type into `SearchInput`, assert fewer items rendered                             |
| Form shows error on invalid submit | fill invalid value + press submit → `getByText('error message')`                 |

#### Test setup

```ts
// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/home-dashboard",
  Link: ({ children }: any) => children,
}));
```

- Use `@testing-library/react-native` — `render`, `fireEvent`, `waitFor`.
- Do NOT mock `fetch` or any API — this skill does not involve real calls.
- Run `pnpm test --watchAll=false` to verify before marking done.

### Step 5 — Checklist and update tracking

After completing an item:

1. Open `docs/track_pages_and_components.md`.
2. If a `ui_functional_implemented` column does not exist, add it after `slicing_implemented` in the relevant phase table header.
3. Change `[]` → `[x]` for the completed item in that column.
4. Update `implementation_notes` with any significant decisions (e.g., "mock data in MOCK_BARBERS constant", "CalendarModal wired to selectedDate state").
5. If the item is outside the design phases (utility, dev tooling, infra), add it to the **Miscellaneous / Infrastructure** section.
6. If a new coding pattern was introduced, add it to `docs/project-conventions.md`.

### Step 6 — Continue or stop

- Continue to the next item within the same phase.
- After all items in the phase are done, report a summary and **stop**. Do not auto-start the next phase.

### Step 7 — Quality check and commit

1. Run `npx tsc --noEmit` — fix all TypeScript errors.
2. Run `npx expo lint` — fix all warnings.
3. Run `pnpm test --watchAll=false` if tests were written.
4. Commit with a clear message, e.g.:
   - `feat: wire BottomTabBar navigation and ScheduleScreen interactive state`
   - `feat: add CalendarModal and DayChipRow selection to schedule screen`
   - `test: ui interaction tests for BarbershopManagementScreen`
5. Push to `origin dev`.

---

## Project Patterns

> **These are summaries. The authoritative source is `docs/project-conventions.md`. Always read that file first.**

### Navigation

- `expo-router` typed router; use `router.push('/route')`, `router.replace('/route')`, `router.back()`.
- Route types are auto-generated after `npx expo start`. See AGENTS.md for note on type errors.

### State

- No global store by default. Use `useState`/`useReducer` locally.
- If a store already exists in `src/services/` or `src/features/<feature>/`, follow its pattern.

### Gesture handling

- `react-native-gesture-handler` is installed — use `GestureHandlerRootView` at the root if not already present.
- `react-native-reanimated` is installed — use `useSharedValue` / `useAnimatedStyle` for smooth animations.

### Icons

- Use `@expo/vector-icons` (`Ionicons`, `MaterialIcons`, etc.) — already installed.

### Tests

- `jest-expo` preset; `@testing-library/react-native` installed.
- Run: `pnpm test --watchAll=false`.

---

## File References

- **Conventions (read first):** [docs/project-conventions.md](../../../docs/project-conventions.md)
- Tracking: [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md)
- Page descriptions: [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md)
- PNG references: `ui-ux-pages-pngs/` (load only for the current item)
- Project structure: [AGENTS.md](../../../AGENTS.md)
- Slicing skill (prior phase): [.claude/skills/slicing-implementation/SKILL.md](../slicing-implementation/SKILL.md)
- API integration skill (next phase): [.claude/skills/functional-implementation/SKILL.md](../functional-implementation/SKILL.md)
