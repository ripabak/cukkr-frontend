import { Colors } from "@/src/theme/colors";

export const authTheme = {
  colors: {
    pageBackground: Colors.bg.surface, // #f9f9f9 — clean neutral page
    cardBackground: Colors.bg.default, // #ffffff — white card
    textPrimary: Colors.text.primary, // #1a1a1a
    textSecondary: Colors.text.secondary, // #6b7280
    border: Colors.border.default, // #ebebeb
    inputBackground: Colors.bg.default, // #ffffff
    accent: Colors.brand.primary, // #ffc81e — yellow CTA
    accentDark: Colors.brand.primaryDark, // #e6b80b — pressed/emphasis
    accentText: Colors.text.primary, // #1a1a1a — text on yellow bg
    white: Colors.bg.default,
  },
  radius: {
    card: 32,
    input: 14,
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
