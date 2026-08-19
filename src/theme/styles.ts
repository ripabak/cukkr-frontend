/**
 * Soft Flat Design System — shared styling utilities.
 *
 * Replaces the legacy neumorphic helpers (kept as a deprecated alias) with a
 * Modern Soft Flat system: pure surfaces, hairline borders, soft tinted
 * shadows. No dual-light/dark neumorphic offsets.
 *
 * Use these helpers to keep surfaces, shadows, and status tints consistent.
 */
import { Colors } from "./colors";
import { DarkColors } from "./darkColors";
import { useTheme, type ThemeColors } from "./ThemeContext";
import { useMemo } from "react";
import { Platform, StyleSheet, ViewStyle } from "react-native";

export type BookingStatus =
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "requested"
  | "declined";

/* ------------------------------------------------------------------ */
/* Soft Flat primitives                                                */
/* ------------------------------------------------------------------ */

const HAIRLINE = "rgba(21, 26, 34, 0.07)"; // card outlines
const HAIRLINE_STRONG = "rgba(21, 26, 34, 0.12)"; // pressed outlines
const SHADOW_COLOR = "rgba(23, 28, 35, 0.08)"; // soft tinted shadow
const SHADOW_ACCENT = "rgba(245, 185, 35, 0.38)"; // amber glow

const isWeb = Platform.OS === "web";

/**
 * Build component styles from the active palette.
 *
 * Pass a factory that ALWAYS returns `StyleSheet.create({ ... })`:
 *
 * ```ts
 * const createStyles = (c: ThemeColors) =>
 *   StyleSheet.create({
 *     card: { backgroundColor: c.bg.surface, borderColor: c.border.light },
 *     title: { color: c.text.primary, fontSize: 16 },
 *   });
 *
 * const styles = useThemedStyles(createStyles);
 * ```
 *
 * The `StyleSheet.create` inside the factory gives exact per-style types, and
 * the hook memoizes the result so colours swap reactively on theme change.
 */
export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}

/** Dark variant type helper — keeps palette references type-safe in factories. */
export type ThemedColors = ThemeColors;
export type DarkColorsType = typeof DarkColors;

/** Flat elevated surface: hairline border + soft drop shadow. */
export function softRaised(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  if (isWeb) {
    return {
      backgroundColor: bg,
      borderWidth: 1,
      borderColor: HAIRLINE,
      boxShadow: `0 1px 2px rgba(23, 28, 35, 0.03), 0 ${6 * intensity}px ${
        20 * intensity
      }px ${SHADOW_COLOR}`,
    };
  }
  return {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: HAIRLINE,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 * intensity },
    shadowOpacity: 1,
    shadowRadius: 12 * intensity,
    elevation: 2 * intensity,
  };
}

/** Flat recessed well (inputs, icon wells): hairline border only. */
export function softInset(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  return {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: intensity > 0.7 ? HAIRLINE : Colors.border.light,
  };
}

/** Floating sheet / modal surface: strong soft elevation. */
export function softFloat(
  bg: string = Colors.bg.elevated,
  intensity: number = 1,
): ViewStyle {
  if (isWeb) {
    return {
      backgroundColor: bg,
      borderWidth: 1,
      borderColor: HAIRLINE,
      boxShadow: `0 -2px 12px rgba(23, 28, 35, 0.04), 0 ${
        10 * intensity
      }px ${32 * intensity}px rgba(23, 28, 35, 0.12)`,
    };
  }
  return {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: HAIRLINE,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 24 * intensity,
    elevation: 10 * intensity,
  };
}

/** Small chip / button surface: lighter shadow than raised. */
export function softSoft(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  if (isWeb) {
    return {
      backgroundColor: bg,
      borderWidth: 1,
      borderColor: HAIRLINE,
      boxShadow: `0 1px 2px rgba(23, 28, 35, 0.03), 0 ${
        3 * intensity
      }px ${8 * intensity}px rgba(23, 28, 35, 0.06)`,
    };
  }
  return {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: HAIRLINE,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 * intensity },
    shadowOpacity: 1,
    shadowRadius: 6 * intensity,
    elevation: 2,
  };
}

/** Pressed / active state: slightly darker hairline, no lift. */
export function softPressed(
  bg: string = Colors.bg.surface,
  _intensity: number = 1,
): ViewStyle {
  return {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: HAIRLINE_STRONG,
  };
}

/** Brand accent surface with a soft amber-tinted glow. */
export function softAccent(intensity: number = 1): ViewStyle {
  if (isWeb) {
    return {
      backgroundColor: Colors.brand.primary,
      boxShadow: `0 ${5 * intensity}px ${14 * intensity}px ${SHADOW_ACCENT}`,
    };
  }
  return {
    backgroundColor: Colors.brand.primary,
    shadowColor: SHADOW_ACCENT,
    shadowOffset: { width: 0, height: 4 * intensity },
    shadowOpacity: 1,
    shadowRadius: 10 * intensity,
    elevation: 3 * intensity,
  };
}

/* ------------------------------------------------------------------ */
/* Status styling (unchanged semantics)                                */
/* ------------------------------------------------------------------ */

const STATUS_STYLE: Record<
  BookingStatus,
  { color: string; surface: string; icon: string }
> = {
  waiting: {
    color: Colors.status.warning,
    surface: Colors.status.warningSurface,
    icon: "time",
  },
  in_progress: {
    color: Colors.status.inProgress,
    surface: Colors.status.inProgressSurface,
    icon: "cut",
  },
  completed: {
    color: Colors.status.success,
    surface: Colors.status.successSurface,
    icon: "checkmark",
  },
  cancelled: {
    color: Colors.status.danger,
    surface: Colors.status.dangerSurface,
    icon: "close",
  },
  requested: {
    color: Colors.status.requested,
    surface: Colors.status.requestedSurface,
    icon: "mail",
  },
  declined: {
    color: Colors.status.declined,
    surface: Colors.status.declinedSurface,
    icon: "close-circle",
  },
};

export function getStatusStyle(status: BookingStatus) {
  return STATUS_STYLE[status] ?? STATUS_STYLE.waiting;
}

export function getStatusColor(status: BookingStatus) {
  return STATUS_STYLE[status]?.color ?? Colors.text.secondary;
}

export function getStatusSurface(status: BookingStatus) {
  return STATUS_STYLE[status]?.surface ?? Colors.bg.surface;
}

/**
 * Soft Flat helpers — the current design system.
 * Use these in new code.
 */
export const Soft = {
  raised: softRaised,
  inset: softInset,
  float: softFloat,
  soft: softSoft,
  pressed: softPressed,
  accent: softAccent,
};

/**
 * Deprecated alias kept for compatibility with legacy screens.
 * Same soft-flat implementation — the neumorphic look is gone.
 */
export const Neu = Soft;

export const Status = {
  getStyle: getStatusStyle,
  getColor: getStatusColor,
  getSurface: getStatusSurface,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
};
