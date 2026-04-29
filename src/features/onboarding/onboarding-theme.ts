// Onboarding Feature Theme & Colors
export const OnboardingTheme = {
  colors: {
    primary: "#C6FF4D", // Green accent
    dark: "#1A1A1A",
    white: "#FFFFFF",
    lightBg: "#F5F5F5",
    textDark: "#000000",
    textGray: "#666666",
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
    },
    subheading: {
      fontSize: 18,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: "400" as const,
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
