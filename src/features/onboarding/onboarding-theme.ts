import { Colors } from "@/src/theme/colors";

export const OnboardingTheme = {
  colors: {
    primary: Colors.brand.primary,
    primaryDark: Colors.brand.primaryDark,
    dark: Colors.text.primary,
    white: Colors.bg.default,
    lightBg: Colors.bg.surface,
    textDark: Colors.text.primary,
    textGray: Colors.text.secondary,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  typography: {
    heading: {
      fontSize: 30,
      fontWeight: "700" as const,
      fontFamily: "PlusJakartaSans_700Bold" as const,
      lineHeight: 36,
    },
    subheading: {
      fontSize: 18,
      fontWeight: "600" as const,
      fontFamily: "PlusJakartaSans_600SemiBold" as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      fontFamily: "PlusJakartaSans_400Regular" as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: "400" as const,
      fontFamily: "PlusJakartaSans_400Regular" as const,
      lineHeight: 20,
    },
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
};

export default OnboardingTheme;
