import { Colors } from "./theme/colors";

export const AppTheme = {
  colors: {
    bg: Colors.bg.default,
    surface: Colors.bg.surface,
    card: Colors.bg.surface,
    dark: Colors.text.primary,
    gray: Colors.text.secondary,
    lightGray: Colors.icon.muted,
    accent: Colors.brand.primary,
    accentDark: Colors.brand.primaryDark,
    border: Colors.border.default,
    danger: Colors.status.danger,
    dangerBg: Colors.status.dangerSurface,
    infoRowBg: Colors.bg.surface,
    blue: Colors.status.info,
    orange: Colors.status.warning,
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, xxxxl: 48 },
  borderRadius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 999 },
  typography: {
    heading: { fontSize: 30, fontWeight: "700" as const, fontFamily: "PlusJakartaSans_700Bold" as const, lineHeight: 36 },
    subheading: { fontSize: 22, fontWeight: "700" as const, fontFamily: "PlusJakartaSans_700Bold" as const, lineHeight: 28 },
    body: { fontSize: 15, fontWeight: "400" as const, fontFamily: "PlusJakartaSans_400Regular" as const, lineHeight: 22 },
    caption: { fontSize: 13, fontWeight: "400" as const, fontFamily: "PlusJakartaSans_400Regular" as const, lineHeight: 18 },
    label: { fontSize: 14, fontWeight: "500" as const, fontFamily: "PlusJakartaSans_500Medium" as const, lineHeight: 18 },
  },
};
export default AppTheme;
