export const AppTheme = {
  colors: {
    bg: '#EEEEE0',
    card: '#FFFFFF',
    dark: '#1A1A1A',
    gray: '#666666',
    lightGray: '#B0ADA0',
    accent: '#C6FF4D',
    border: '#E0DDD0',
    danger: '#E53E3E',
    dangerBg: '#FFE4E4',
    infoRowBg: '#D9E8A0',
    blue: '#2196F3',
    orange: '#FF9800',
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
