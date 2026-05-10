import { Colors } from './theme/colors';

export const AppTheme = {
  colors: {
    bg: Colors.bg.default,
    surface: Colors.bg.surface,
    card: Colors.bg.default,
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
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  borderRadius: { sm: 6, md: 12, lg: 16, xl: 24, full: 999 },
  typography: {
    heading: { fontSize: 28, fontWeight: '700' as const },
    subheading: { fontSize: 20, fontWeight: '700' as const },
    body: { fontSize: 14, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
    label: { fontSize: 13, fontWeight: '500' as const },
  },
};
export default AppTheme;
