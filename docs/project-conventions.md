# Project Conventions (frontend)

Complement to the root `AGENTS.md`. This file documents the theme (dark mode)
and toast conventions that every screen/component must follow.

## Theme / Dark Mode

The app ships with a **runtime light / dark / system** theme. Default is
**light**. The preference is persisted in `AsyncStorage`
(key `cukkr_theme_mode`) and hydrates before first paint (no flash).

### Token sources

| What | Where | Notes |
|---|---|---|
| Light palette | `src/theme/colors.ts` (`Colors`) | The historical static palette. |
| Dark palette | `src/theme/darkColors.ts` (`DarkColors`) | Same exact key shape as `Colors`. |
| Theme state | `src/theme/ThemeContext.tsx` | `ThemeProvider` + `useTheme()`. |
| Active palette | `useTheme().colors` | `ThemeColors` type (all values widened to `string`). |
| Style builder | `useThemedStyles(factory)` | `src/theme/styles.ts`. |

### Usage rules (mandatory)

1. **Never read the static `Colors` in components/screens.** Anything that
   renders must source colors from the active palette:
   ```tsx
   const { colors, isDark, mode } = useTheme();
   const styles = useThemedStyles(createStyles);
   ```
2. Style factories **must** call `StyleSheet.create`:
   ```tsx
   const createStyles = (c: ThemeColors) =>
     StyleSheet.create({
       card: { backgroundColor: c.bg.surface, borderColor: c.border.light },
       title: { color: c.text.primary },   // fontSize etc. unchanged
     });
   ```
   Return type is inferred; do not try to return plain objects (they widen
   literals and break `styles.x` typing).
3. Inline JSX colors (`<Ionicons color>`, `ScreenShell backgroundColor`,
   `Neu.*(Colors.x)`) → `colors.x`.
4. **Module-level constants that hold colors** (config arrays, status maps)
   must become `(c: ThemeColors) => …` factories or be derived from `colors`
   inside the component. Never leave a static `Colors.` reference in a file
   that renders — verify with `rg "Colors\\." <file>`.
5. If a file also exports color-option factories used by several screens
   (e.g. `StatusFilterMenu.getScheduleStatusOptions`), make them take
   `(c: ThemeColors, …)` and pass `colors` at the call site.
6. `60`-only components: if a sub-component inside a file also uses
   `styles`/`colors`, that component calls the hooks itself.

### Theme toggle entry points

- **Profile** → “Tampilan / Appearance” section → opens
  `ThemePickerSheet` (Light / Dark / System).
- **Login screen** → top-right moon/sun button → opens the same sheet.
- Reuse `<ThemePickerSheet visible onClose />` from `@/src/components`.

### Chrome

- `PwaStatusBar` (root) reads the theme and syncs web `theme-color` + native
  status bar automatically.
- Navigation theme + `Stack contentStyle` in `app/d/_layout.tsx` follow
  `useTheme().isDark` / `colors.bg.default`.

## Toast

Location: `src/lib/providers/toast/*`. Reusable white card with:

- a **filled icon inside a colored circle** (icon + circle color follow type),
- **title** (bold) + optional short **description** (≤ 2 lines),
- an **X** close button (+ tap-anywhere + auto-dismiss),
- a **white base** in both light & dark.

| Type | Circle color | Icon |
|---|---|---|
| `neutral` | gray | `notifications` |
| `success` | green | `checkmark-circle` |
| `info` | blue | `information-circle` |
| `warning` | orange | `alert-circle` |
| `error` | red | `close-circle` |

API:

```tsx
const toast = useToast();
toast.success("Tersimpan");                       // title only
toast.success("Tersimpan", "Catatan disimpan", 3000);
toast.error("Gagal", getErrorMessage(error));
toast.warning("Periksa kembali", "…", 4000);      // 0 = sticky (X to close)
toast.show({ type: "info", title: "…", description: "…", duration: 0 });
```

Backwards-compatible: `toast.success(msg, duration)` (a number second arg)
still works. Full guide: `docs-guides/TOAST_USAGE_EXAMPLES.md`.
Migrations for future dark-mode work: `docs-guides/DARK_MODE_CONVERSION.md`.
