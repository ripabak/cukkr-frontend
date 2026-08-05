/**
 * Cukkr Design System — Color Tokens
 *
 * Modern native app palette with a soft neumorphic base. The brand amber is used
 * sparingly as an accent. Status colors are tuned to feel calm and consistent.
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
    primary: "#f5b923", // amber — CTAs, active states, highlights
    primaryDark: "#d99a0a", // dark amber — pressed, selected, emphasis
    primarySurface: "#fff6db", // very light amber — subtle tinted backgrounds
  },

  bg: {
    default: "#f0f2f5", // main screen background — soft cool gray
    surface: "#f7f9fc", // cards, sections, raised surfaces
    cream: "#f7f5f0", // warm off-white (schedule, legacy)
    overlay: "rgba(23, 28, 35, 0.55)",
  },

  text: {
    primary: "#1f2328", // headings, body copy
    secondary: "#5e6670", // labels, captions, hints
    muted: "#9aa2ad", // placeholders, disabled
    inverse: "#ffffff", // text on dark/brand backgrounds
  },

  icon: {
    muted: "#8b95a3", // inactive / decorative icons
    default: "#3a3f47", // active / emphasis icons
    light: "#b4bcc8", // very subtle icon tint
  },

  border: {
    default: "#e1e5eb", // standard input borders, card outlines
    light: "#eef1f5", // very subtle dividers/separators
    focus: "#f5b923", // focused input border (brand amber)
  },

  status: {
    info: "#3b82f6",
    infoSurface: "#eff6ff",
    success: "#10b981",
    successSurface: "#ecfdf5",
    warning: "#f59e0b",
    warningSurface: "#fffbeb",
    danger: "#ef4444",
    dangerSurface: "#fef2f2",
    waiting: "#f59e0b",
    waitingSurface: "#fffbeb",
    inProgress: "#3b82f6",
    inProgressSurface: "#eff6ff",
    requested: "#6366f1",
    requestedSurface: "#eef2ff",
    declined: "#ef4444",
    declinedSurface: "#fef2f2",
  },
} as const;

export type BrandColor = (typeof Colors.brand)[keyof typeof Colors.brand];
export default Colors;
