/**
 * Cukkr Design System — Color Tokens
 *
 * Single source of truth for all colors in the app.
 * Brand color is yellow (#ffc81e), used sparingly as accent/highlight.
 *
 * Usage guide:
 *   Brand    → primary CTA buttons, active tab, toggle ON, key highlights
 *   BG       → screen backgrounds and card surfaces
 *   Text     → all text / label use cases
 *   Icon     → icon tints only
 *   Border   → input borders, dividers, card outlines
 *   Status   → semantic / booking state colors
 */
export const Colors = {
  brand: {
    primary: '#ffc81e',      // yellow — CTAs, active states, highlights
    primaryDark: '#e6b80b',  // dark yellow — pressed, selected, emphasis
    primarySurface: '#fff8e1', // very light yellow — subtle tinted backgrounds
  },

  bg: {
    default: '#ffffff',      // main screen background
    surface: '#f9f9f9',      // cards, sections on white backgrounds
    overlay: 'rgba(0,0,0,0.45)',
  },

  text: {
    primary: '#1a1a1a',      // headings, body copy
    secondary: '#6b7280',    // labels, captions, hints
    muted: '#9ca3af',        // placeholders, disabled
    inverse: '#ffffff',      // text on dark/brand backgrounds
  },

  icon: {
    muted: '#a5a8ad',        // inactive / decorative icons
    default: '#1a1a1a',      // active / emphasis icons
    light: '#c4c7cc',        // very subtle icon tint
  },

  border: {
    default: '#ebebeb',      // standard input borders, card outlines
    light: '#f0f0f0',        // very subtle dividers/separators
    focus: '#ffc81e',        // focused input border (brand yellow)
  },

  status: {
    info: '#2196f3',
    infoSurface: '#e8f4fd',
    success: '#22c55e',
    successSurface: '#f0fdf4',
    warning: '#ff9800',
    warningSurface: '#fff7ed',
    danger: '#ef4444',
    dangerSurface: '#fef2f2',
    waiting: '#f0a11a',
    waitingSurface: '#fff3e0',
    inProgress: '#2196f3',
    inProgressSurface: '#e3efff',
  },
} as const;

export type BrandColor = typeof Colors.brand[keyof typeof Colors.brand];
export default Colors;
