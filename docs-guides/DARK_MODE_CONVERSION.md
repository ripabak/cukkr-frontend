# Dark Mode Conversion Protocol

Goal: make every component/screen read colors from the ACTIVE theme palette so
the app can switch light ↔ dark at runtime. Read this fully before editing.

## Active theme

- `useTheme()` from `@/src/theme/ThemeContext` returns
  `{ mode, resolved, isDark, colors, setMode, hydrated }`.
- `colors` is the active palette (`Colors` light or `DarkColors`), typed as
  `ThemeColors` (all values `string`).
- `useThemedStyles(factory)` from `@/src/theme/styles` builds styles from the
  active palette and memoizes on theme. Feed it a plain factory (NO
  `StyleSheet.create` inside).

```tsx
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
```

## The ONLY rule

**After converting a file, it must contain ZERO `Colors.` references** (the
static light import) — everything color-related reads from the active theme.
Verify at the end: `rg -n "Colors\." <file>` → no output (ignore comment text).

## Conversion steps (per file)

1. **Imports**
   - Remove `import { Colors } from "@/src/theme/colors";`.
   - Add:
     ```ts
     import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
     import { useThemedStyles } from "@/src/theme/styles";
     ```
   - Keep `StyleSheet` import ONLY if still used (e.g. `StyleSheet.hairlineWidth`, `StyleSheet.absoluteFill`). Otherwise remove it.

2. **Module-scope `const styles = StyleSheet.create({ ... })`** → replace with a
   factory named `createStyles` that calls `StyleSheet.create` and keeps every
   non-color value identical; inside, `Colors.X` becomes `c.X`.

   ⚠️ The factory MUST call `StyleSheet.create({ ... })` (not return a plain
   object) — that is what gives each style its exact typed shape.

   ```ts
   // BEFORE
   const styles = StyleSheet.create({
     card: { backgroundColor: Colors.bg.surface, borderColor: Colors.border.light },
     title: { color: Colors.text.primary, fontSize: 16 },
   });

   // AFTER
   const createStyles = (c: ThemeColors) =>
     StyleSheet.create({
       card: { backgroundColor: c.bg.surface, borderColor: c.border.light },
       title: { color: c.text.primary, fontSize: 16 },
     });
   ```

3. **In the component body**, near the top (hooks rules!):
   ```ts
   const { colors } = useTheme();
   const styles = useThemedStyles(createStyles);
   ```
   If the component is small and styles aren't used in all renders, still call
   hooks unconditionally at the top of the component function.

4. **Inline color props** in JSX (`color={Colors.x}`, `backgroundColor={Colors.y}`,
   `dotColor={...}`, icon colors, etc.) → `colors.x` / `colors.y`.

5. **`ScreenShell backgroundColor={Colors.bg.default}`** → `backgroundColor={colors.bg.default}`
   (ScreenShell's own default is already themed, so you can also just drop the prop).

6. **Module-level constants that reference Colors** (e.g. `const X = Colors.bg.cream`,
   config arrays `{ tint: Colors.brand.primary, surface: Colors.brand.primarySurface }`)
   → build them from the palette. Two acceptable options:
   - Make them a function `(c: ThemeColors) => [...]` and call with `colors` inside the component (store via `useMemo` if it's a big array).
   - Or define them inside the component from `colors`.

7. **Pure-static files**: if a file uses `ThemeColors`/`useTheme` already, or has
   NO color usage → skip it. Don't add hooks to hook-less utility modules.

8. **Never touch**:
   - `src/theme/colors.ts`, `src/theme/darkColors.ts`, `src/theme/ThemeContext.tsx`
   - `src/theme/styles.ts` (already themed)
   - Files that already call `useTheme()` / `useThemedStyles` (already converted).
   - Logic, layout numbers, spacing, strings, i18n keys, structure. ONLY color sourcing.

9. **Verify**: run `npx tsc --noEmit -p tsconfig.json` (from `cukkr-frontend/`).
   It must end with 0 errors. Fix any you introduced. A few pre-existing errors in
   unrelated files are not yours — but this repo is currently at 0, so keep it 0.

## Special case: `src/features/auth/auth-theme.ts`

It exports a static `authTheme`. Convert it to a factory + hook:

```ts
import { Colors, type ThemeColors } from "@/src/theme/ThemeContext"; // no — see below
```

Actually do this EXACTLY:

```ts
import type { ThemeColors } from "@/src/theme/ThemeContext";

export const buildAuthTheme = (c: ThemeColors) => ({
  colors: {
    pageBackground: c.bg.default,
    cardBackground: c.bg.surface,
    textPrimary: c.text.primary,
    textSecondary: c.text.secondary,
    border: c.border.default,
    inputBackground: c.bg.surface,
    accent: c.brand.primary,
    accentSurface: c.brand.primarySurface,
    accentDark: c.brand.primaryDark,
    accentText: c.text.primary,
    white: c.bg.default,
  },
  radius: { card: 32, input: 16, pill: 999 },
  spacing: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 },
});

export type AuthTheme = ReturnType<typeof buildAuthTheme>;
```

Then auth screens/components switch `authTheme` → `const theme = buildAuthTheme(colors)`.

## Reporting

After finishing your assigned files, report:
- list of converted files
- any file you skipped and why
- `tsc` result (must be 0 errors)
