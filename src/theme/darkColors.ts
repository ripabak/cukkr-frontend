/**
 * Dark palette — mirrors the exact key structure of `Colors` (light) so the
 * whole app can swap palettes by replacing `Colors` with this object.
 *
 * Warm near-black neutrals keep the brand gold native (same family as light),
 * surfaces step up from the background for cards/sheets, and status tones get
 * brighter fills so icon/badge contrast holds on dark.
 */
export const DarkColors = {
  brand: {
    primary: "#f5b923", // gold stays — CTAs, active states, icons
    primaryDark: "#e8a508",
    text: "#f5b923", // gold text pops on dark (instead of rich-brown)
    primarySurface: "#3a2f13", // deep gold tint — chips, badge fills
  },

  bg: {
    default: "#16130f", // main screen background — warm near-black
    surface: "#1e1a15", // cards, sections, raised surfaces
    elevated: "#26211b", // sheets, popovers
    cream: "#1b1813",
    overlay: "rgba(0, 0, 0, 0.62)", // scrim behind sheets / modals
    chrome: "#0d0b08", // warm desktop frame
  },

  text: {
    primary: "#f4f0e8", // warm off-white — headings, body
    secondary: "#b9b1a4", // warm taupe — labels, captions
    muted: "#857c6e", // placeholders, disabled
    inverse: "#16130f", // text meant for inverted (light) surfaces
  },

  icon: {
    muted: "#8d8578",
    default: "#ece7de",
    light: "#5b5449",
  },

  border: {
    default: "#383228",
    light: "#2b261f",
    focus: "#f5b923",
  },

  status: {
    neutral: "#9a9286",
    neutralSurface: "#2b261f",
    info: "#60a5fa",
    infoSurface: "#182741",
    success: "#34d399",
    successSurface: "#122a21",
    warning: "#fb923c",
    warningSurface: "#342110",
    danger: "#f87171",
    dangerSurface: "#341616",
    waiting: "#fb923c",
    waitingSurface: "#342110",
    inProgress: "#60a5fa",
    inProgressSurface: "#182741",
    requested: "#8b93f8",
    requestedSurface: "#1e2038",
    declined: "#f87171",
    declinedSurface: "#341616",
  },
} as const;
