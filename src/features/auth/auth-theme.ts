export const authTheme = {
  colors: {
    pageBackground: "#63B476",
    cardBackground: "#F4F2E7",
    textPrimary: "#2F3A2F",
    textSecondary: "#6E766C",
    border: "#BCC4B6",
    inputBackground: "#FBFAF5",
    accent: "#C4EB35",
    accentText: "#1F2A18",
    mutedAccent: "#A7D92C",
    white: "#FFFFFF",
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