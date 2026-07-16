import { Colors } from "@/src/theme/colors";

export const OnboardingTheme = {
  colors: {
    primary: Colors.brand.primary, // #ffc81e — yellow accent
    primaryDark: Colors.brand.primaryDark, // #e6b80b
    dark: Colors.text.primary, // #1a1a1a
    white: Colors.bg.default, // #ffffff
    lightBg: Colors.bg.surface, // #f9f9f9
    textDark: Colors.text.primary, // #1a1a1a
    textGray: Colors.text.secondary, // #6b7280
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
      fontSize: 28,
      fontWeight: "700" as const,
      fontFamily: "PlusJakartaSans_700Bold" as const,
    },
    subheading: {
      fontSize: 18,
      fontWeight: "600" as const,
      fontFamily: "PlusJakartaSans_600SemiBold" as const,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      fontFamily: "PlusJakartaSans_400Regular" as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: "400" as const,
      fontFamily: "PlusJakartaSans_400Regular" as const,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 999,
  },
};

export default OnboardingTheme;
