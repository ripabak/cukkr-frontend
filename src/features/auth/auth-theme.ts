import { Colors } from "@/src/theme/colors";

export const authTheme = {
  colors: {
    pageBackground: Colors.bg.default, // soft gray page
    cardBackground: Colors.bg.surface, // slightly lighter surface
    textPrimary: Colors.text.primary,
    textSecondary: Colors.text.secondary,
    border: Colors.border.default,
    inputBackground: Colors.bg.surface,
    accent: Colors.brand.primary,
    accentSurface: Colors.brand.primarySurface,
    accentDark: Colors.brand.primaryDark,
    accentText: Colors.text.primary,
    white: Colors.bg.default,
  },
  radius: {
    card: 32,
    input: 16,
    pill: 999,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

export type AuthTheme = typeof authTheme;
