import type { ThemeColors } from "@/src/theme/ThemeContext";

/** Theme-independent layout constants for the auth feature. */
export const authRadius = {
  card: 32,
  input: 16,
  pill: 999,
} as const;

export const authSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Build the auth palette-driven theme from the ACTIVE theme colors. */
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
  radius: authRadius,
  spacing: authSpacing,
});

export type AuthTheme = ReturnType<typeof buildAuthTheme>;
