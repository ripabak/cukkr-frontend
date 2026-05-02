# Project Conventions

> **Single source of truth** for coding style, theming, naming, and component patterns in cukkr-frontend.
> Every LLM agent and developer must read this before creating or modifying any file.
> Update this document whenever a new pattern is established.

---

## 1. File & Folder Structure

```
app/                        # Route layer only — no business logic
  _layout.tsx               # Root layout; global wrappers go here
  index.tsx                 # Entry point — only a <Redirect /> to first screen
  dev-nav.tsx               # Dev-only navigation hub (not a production route)
  (scope)/                  # Route group — groups routes, no URL segment
    page-name.tsx           # Thin file — only imports and mounts the screen

src/
  app-theme.ts              # Global design tokens (colors, spacing, radii, typography)
  components/               # Shared components used across 2+ features
  features/
    <feature>/
      <feature>-theme.ts    # Feature-specific tokens (extends AppTheme only if needed)
      components/           # Components used only inside this feature
      screens/              # Screen implementations (contain UI + local state)
      services/             # API calls and business logic (no UI)
      utils/                # Pure helpers, validators, formatters
  services/                 # Global reusable services (HTTP client, storage, etc.)
  utils/                    # Global reusable utilities
```

**Rules:**

- `app/(scope)/page.tsx` must be thin — one import, one `export default` that mounts the screen.
- Business logic, state, and UI always live in `src/features/<feature>/screens/`.
- A component used in only one feature goes in `src/features/<feature>/components/`.
- A component used across 2+ features goes in `src/components/`.

---

## 2. Theme System

### Global tokens — `src/app-theme.ts`

Use `AppTheme` for any component in `src/components/` and any feature that does **not** have its own theme file.

```ts
import AppTheme from "@/src/app-theme";

// Colors
AppTheme.colors.bg; // '#EEEEE0' — page/screen background
AppTheme.colors.card; // '#FFFFFF' — card/surface
AppTheme.colors.dark; // '#1A1A1A' — primary text, dark buttons
AppTheme.colors.gray; // '#666666' — secondary text, icons
AppTheme.colors.lightGray; // '#B0ADA0' — placeholder, disabled
AppTheme.colors.accent; // '#C6FF4D' — primary accent (lime green)
AppTheme.colors.border; // '#E0DDD0' — dividers, input borders
AppTheme.colors.danger; // '#E53E3E' — error text, destructive actions
AppTheme.colors.dangerBg; // '#FFE4E4' — danger button background
AppTheme.colors.infoRowBg; // '#D9E8A0' — info row / profile card tint
AppTheme.colors.blue; // '#2196F3' — informational state
AppTheme.colors.orange; // '#FF9800' — warning state

// Spacing (use these instead of magic numbers)
AppTheme.spacing.xs; // 4
AppTheme.spacing.sm; // 8
AppTheme.spacing.md; // 12
AppTheme.spacing.lg; // 16
AppTheme.spacing.xl; // 20
AppTheme.spacing.xxl; // 24
AppTheme.spacing.xxxl; // 32

// Border radius
AppTheme.borderRadius.sm; // 6
AppTheme.borderRadius.md; // 12
AppTheme.borderRadius.lg; // 16
AppTheme.borderRadius.xl; // 24
AppTheme.borderRadius.full; // 999 (pill)

// Typography
AppTheme.typography.heading; // { fontSize: 28, fontWeight: '700' }
AppTheme.typography.subheading; // { fontSize: 20, fontWeight: '700' }
AppTheme.typography.body; // { fontSize: 14, fontWeight: '400' }
AppTheme.typography.caption; // { fontSize: 12, fontWeight: '400' }
AppTheme.typography.label; // { fontSize: 13, fontWeight: '500' }
```

### Feature-specific tokens

| Feature        | Theme file                                    | When to use                                           |
| -------------- | --------------------------------------------- | ----------------------------------------------------- |
| `auth`         | `src/features/auth/auth-theme.ts`             | Only inside auth screens and auth-specific components |
| `onboarding`   | `src/features/onboarding/onboarding-theme.ts` | Only inside onboarding screens                        |
| other features | none yet → use `AppTheme`                     | Until a feature's visual language clearly diverges    |

**Rule:** Never hard-code colors or spacing that exist in `AppTheme`. Reference the token instead.

---

## 3. Component Patterns

### Named export (always)

```tsx
// ✅ correct — named export
export function MyComponent({ label }: Props) { ... }

// ❌ wrong — default export for components
export default function MyComponent() { ... }
```

Routes in `app/` use `export default`. Everything in `src/` uses **named exports**.

### Props interface

```tsx
interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle; // always optional, always last
}
```

- Use `interface`, not `type alias`, for component props.
- Always accept an optional `style?: ViewStyle | TextStyle` to allow overrides from the parent.

### StyleSheet

```tsx
// ✅ Always use StyleSheet.create — never inline style objects in JSX
const styles = StyleSheet.create({
  container: { ... },
});

// ❌ Avoid
<View style={{ flex: 1, backgroundColor: '#fff' }}>
```

Exception: dynamic values that depend on props (e.g. `{ backgroundColor: color }`) may be inline.

### Compose styles with arrays

```tsx
<View style={[styles.container, style]} />
<View style={[styles.iconCircle, isActive && styles.activeCircle]} />
```

---

## 4. Screen Patterns

### Wrapper order (outermost → innermost)

```tsx
<SafeAreaView style={{ flex: 1, backgroundColor: AppTheme.colors.bg }}>
  <KeyboardAvoidingView // only when the screen has inputs
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* content */}
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

- `SafeAreaView` is always the outermost.
- `ScrollView` with `contentContainerStyle={{ flexGrow: 1 }}` — **never** `flex: 1` inside `contentContainerStyle`.
- Sticky CTAs, bottom tab bars, and floating buttons sit **outside** any `ScrollView`, inside the `SafeAreaView`.

> **Preferred:** Use `ScreenShell` or `FormShell` instead of writing this boilerplate manually. See Section 4a below.

---

## 4a. Layout Components

### MobileFrame — Web viewport constraint

Applied once in `app/_layout.tsx`. All screens automatically render in a centered 390px frame on web; passthrough `<View style={{ flex: 1 }}>` on native.

```tsx
// app/_layout.tsx — already wired
<MobileFrame>
  <View style={{ flex: 1 }}>
    <Stack screenOptions={{ headerShown: false }} />
  </View>
</MobileFrame>
```

### ScreenShell — Standard scrollable screen

Use for any screen that is primarily scrollable and has **no TextInput** fields.

```tsx
<ScreenShell
  headerSlot={<ScreenHeader onBack={() => router.back()} />}  // sticky above scroll
  footerSlot={<BottomTabBar activeTab="home" />}              // sticky below scroll
  overlaySlot={sortVisible ? <SortMenu ... /> : null}         // absolute overlays (NOT RN Modal)
  backgroundColor="#F5F4E8"                                    // optional, default: AppTheme.colors.bg
  contentStyle={{ paddingBottom: 24 }}                        // optional scrollContent override
>
  {/* scrollable content */}
</ScreenShell>
```

**When to use `overlaySlot`:** For `SortMenu`, `StatusFilterMenu`, `OverflowMenu` — these render a backdrop + absolute-positioned view directly in the component tree (not React Native Modal). They **must** be outside ScrollView or they will be clipped.

**React Native Modal-based components** (`ConfirmationModal`, `AlertModal`, `CalendarModal`, `TimePickerModal`, `SwipeConfirmationModal`) use `<Modal>` from `react-native` and render above everything regardless of JSX position — place them anywhere in `children`.

### FormShell — Keyboard-aware scrollable screen

Identical API to `ScreenShell` but wraps the ScrollView in `KeyboardAvoidingView`. Use whenever the screen has `TextInput` fields.

```tsx
<FormShell
  headerSlot={
    <ScreenHeader title="Edit Profile" onBack={() => router.back()} />
  }
  backgroundColor="#F5F4E8"
>
  <TextInputField label="Name" value={name} onChangeText={setName} />
</FormShell>
```

---

## 5. Navigation Patterns

```tsx
import { useRouter } from "expo-router";
const router = useRouter();

router.push("/home-dashboard"); // navigate forward
router.replace("/onboarding-splash"); // replace current (no back)
router.back(); // go back
```

- Use `router.back()` for `ScreenHeader` back buttons.
- Use `router.replace` for post-auth redirects and splash screens.
- Never navigate inside shared components — pass `onPress` callbacks instead.
- Route type errors on `npx tsc --noEmit`: run `npx expo start` once to regenerate typed routes, then stop.

---

## 6. Naming Conventions

| Item               | Convention                                       | Example                           |
| ------------------ | ------------------------------------------------ | --------------------------------- |
| Component file     | `PascalCase.tsx`                                 | `BookingCard.tsx`                 |
| Screen file        | `PascalCaseScreen.tsx`                           | `LoginScreen.tsx`                 |
| Feature theme      | `kebab-case-theme.ts`                            | `auth-theme.ts`                   |
| Feature service    | `kebab-case-service.ts`                          | `auth-service.ts`                 |
| Feature validator  | `kebab-case-validators.ts`                       | `auth-validators.ts`              |
| Route file         | `kebab-case.tsx`                                 | `login.tsx`, `home-dashboard.tsx` |
| Mock data constant | `SCREAMING_SNAKE_CASE`                           | `MOCK_BARBERS`, `MOCK_BOOKINGS`   |
| Props interface    | `Props` (local) or `<Component>Props` (exported) | `interface Props { ... }`         |

---

## 7. State Management

- **No global store** installed — use `useState` / `useReducer` locally inside screens.
- **Local state only** for UI toggles, modal visibility, active tab, form fields.
- **Lift state** to the nearest common parent when two sibling components need the same value.
- When a global store is added in the future, document it here and follow its existing slice pattern.

---

## 8. Icons

Use `@expo/vector-icons` — already installed. Prefer `Ionicons` for consistency.

```tsx
import { Ionicons } from "@expo/vector-icons";
<Ionicons name="chevron-back" size={18} color={AppTheme.colors.dark} />;
```

---

## 9. Testing

- Preset: `jest-expo`
- Library: `@testing-library/react-native`
- Run: `pnpm test --watchAll=false`

### File placement

| Type           | Location                                                              |
| -------------- | --------------------------------------------------------------------- |
| Screen test    | `src/features/<feature>/screens/__tests__/<ScreenName>.test.tsx`      |
| Component test | `src/components/__tests__/<ComponentName>.test.tsx`                   |
| Service test   | `src/features/<feature>/services/__tests__/<feature>-service.test.ts` |

### expo-router mock (required for every screen test)

```ts
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/home-dashboard",
  Link: ({ children }: any) => children,
  Redirect: () => null,
}));
```

---

## 10. Tracking New Work

All pages, components, and screens — including those not from the design phases — must be recorded in `docs/track_pages_and_components.md`.

For work that falls outside the existing phase tables (e.g. dev tooling, global layout components):

1. Add a **Miscellaneous / Infrastructure** section at the bottom of `track_pages_and_components.md` if it does not exist.
2. Add a row with: `nama`, `lokasi`, `kegunaan`, `implementation_notes`.
3. No slicing or API columns needed for infrastructure items — mark both `[x]` and note `"non-design component"`.

**Already tracked outside design phases:**

| nama          | lokasi                           | kegunaan                                        |
| ------------- | -------------------------------- | ----------------------------------------------- |
| `DevNavFloat` | `src/components/DevNavFloat.tsx` | Global floating dev button → modal → `/dev-nav` |
| `DevNav`      | `app/dev-nav.tsx`                | Full-page debug navigation hub                  |

---

## 11. Key File References

| Purpose                        | Path                                          |
| ------------------------------ | --------------------------------------------- |
| Global theme tokens            | `src/app-theme.ts`                            |
| Auth feature theme             | `src/features/auth/auth-theme.ts`             |
| Onboarding feature theme       | `src/features/onboarding/onboarding-theme.ts` |
| Project structure              | `AGENTS.md`                                   |
| Page/component tracking        | `docs/track_pages_and_components.md`          |
| Page descriptions (design)     | `docs/ui-ux-pages-descriptions.md`            |
| Coding conventions (this file) | `docs/project-conventions.md`                 |
