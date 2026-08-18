/**
 * Cukkr Design System — Color Tokens
 *
 * Modern Soft Flat palette. Calm cool-neutral base, pure-white surfaces with
 * hairline borders, and a single amber brand accent used sparingly on
 * interactive elements (CTAs, active states, highlights). No neumorphic
 * dual shadows — elevation is expressed with soft tinted shadows only.
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
    primarySurface: "#fdf4dc", // soft amber — subtle tinted backgrounds
  },

  bg: {
    default: "#ffffff", // main screen background — white
    surface: "#ffffff", // cards, sections, raised surfaces
    elevated: "#ffffff", // sheets, popovers
    cream: "#f7f5f0", // warm off-white (schedule, legacy)
    overlay: "rgba(15, 19, 26, 0.45)", // scrim behind sheets / modals
    chrome: "#e9ebee", // desktop frame around the mobile web app
  },

  text: {
    primary: "#191c20", // headings, body copy
    secondary: "#5c6470", // labels, captions, hints
    muted: "#98a0ac", // placeholders, disabled
    inverse: "#ffffff", // text on dark backgrounds
  },

  icon: {
    muted: "#8a93a3", // inactive / decorative icons
    default: "#2c3138", // active / emphasis icons
    light: "#b7bdc8", // very subtle icon tint
  },

  border: {
    default: "#e3e6eb", // standard input borders, card outlines
    light: "#eef0f4", // very subtle dividers/separators
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
