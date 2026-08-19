/**
 * Cukkr Design System — Color Tokens
 *
 * Modern Soft Flat palette with a warm base and ONE dominant brand hue: gold.
 *
 * Brand strategy (why every "gold-ish" thing is the same hue):
 *   • Bright gold (#f5b923) is the ONLY filled brand color — CTAs, active
 *     states, icons, highlight markers. It's never used as small text on white
 *     (too low contrast), it's used as a FILL with dark text on top.
 *   • Rich gold (#b37700) is the single deeper shade reserved for brand text /
 *     numbers / labels on white — same hue family, so it reads as "brand",
 *     not brown or orange.
 *   • Semantic oranges (warning/waiting) deliberately use a DIFFERENT hue from
 *     the brand so the app never shows two competing "ambers".
 *
 * Neutrals are warmed (subtle taupe cast) so the gold sits natively instead of
 * clashing with a cool blue-gray scale.
 *
 * Usage guide:
 *   Brand   → primary CTA fills, active tab (icon/border/spotlight), icons,
 *             selected chips, deep-gold accent text/numbers
 *   BG      → screen backgrounds and card surfaces (white, flat)
 *   Text    → all text / label use cases (warm neutrals)
 *   Icon    → icon tints only
 *   Border  → input borders, dividers, card outlines (warm hairlines)
 *   Status  → semantic / booking state colors (separate hue from brand)
 */
export const Colors = {
  brand: {
    primary: "#f5b923", // vivid gold — fills, CTAs, active states, icons
    primaryDark: "#ca8000", // deeper gold — pressed fills, gold edges/rims
    text: "#b37700", // rich gold — brand text/numbers/labels on white
    primarySurface: "#fcefc9", // soft gold tint — chips, badge fills
  },

  bg: {
    default: "#ffffff", // main screen background — white
    surface: "#ffffff", // cards, sections, raised surfaces
    elevated: "#ffffff", // sheets, popovers
    cream: "#f7f4ee", // warm off-white (legacy)
    overlay: "rgba(15, 19, 26, 0.45)", // scrim behind sheets / modals
    chrome: "#ecebe6", // warm desktop frame around the mobile web app
  },

  text: {
    primary: "#1e1b16", // warm near-black — headings, body copy
    secondary: "#5a5349", // warm taupe — labels, captions, hints
    muted: "#948b7d", // warm muted — placeholders, disabled
    inverse: "#ffffff", // text on dark backgrounds
  },

  icon: {
    muted: "#8f8678", // inactive / decorative icons
    default: "#2b2722", // active / emphasis icons
    light: "#b8af9f", // very subtle icon tint
  },

  border: {
    default: "#e7e0d4", // standard input borders, card outlines
    light: "#f2ede3", // very subtle dividers/separators
    focus: "#f5b923", // focused input border (brand gold)
  },

  status: {
    info: "#3b82f6",
    infoSurface: "#eff6ff",
    success: "#10b981",
    successSurface: "#ecfdf5",
    warning: "#f97316", // orange — distinct hue from brand gold
    warningSurface: "#fff4e8",
    danger: "#ef4444",
    dangerSurface: "#fef2f2",
    waiting: "#f97316", // = warning (orange), distinct from brand
    waitingSurface: "#fff4e8",
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
