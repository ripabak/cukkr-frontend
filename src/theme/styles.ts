/**
 * Neumorphic / native-style shared styling utilities.
 *
 * Use these helpers to keep surfaces, shadows, and status tints consistent.
 */
import { Colors } from "./colors";
import { Platform, ViewStyle } from "react-native";

export type BookingStatus =
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "requested"
  | "declined";

/** Shadow color derived from the background for tinted shadows. */
const SHADOW_DARK = "rgba(174, 178, 192, 0.45)";
const SHADOW_LIGHT = "rgba(255, 255, 255, 0.85)";

const isWeb = Platform.OS === "web";

/**
 * Raised neumorphic surface shadow.
 * On web it uses a CSS `boxShadow` string with two offset shadows.
 * On native it falls back to a single subtle shadow.
 */
export function neuRaised(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  const dark = `rgba(174, 178, 192, ${0.35 * intensity})`;
  const light = "rgba(255, 255, 255, 0.85)";
  if (isWeb) {
    return {
      backgroundColor: bg,
      boxShadow: `${6 * intensity}px ${6 * intensity}px ${
        12 * intensity
      }px ${dark}, -${6 * intensity}px -${6 * intensity}px ${
        12 * intensity
      }px ${light}`,
    };
  }
  return {
    backgroundColor: bg,
    shadowColor: dark,
    shadowOffset: { width: 3 * intensity, height: 3 * intensity },
    shadowOpacity: 1,
    shadowRadius: 6 * intensity,
    elevation: 4 * intensity,
  };
}

/** Inset / pressed neumorphic surface. */
export function neuInset(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  const dark = `rgba(174, 178, 192, ${0.3 * intensity})`;
  const light = "rgba(255, 255, 255, 0.75)";
  if (isWeb) {
    return {
      backgroundColor: bg,
      boxShadow: `inset ${4 * intensity}px ${4 * intensity}px ${
        8 * intensity
      }px ${dark}, inset -${4 * intensity}px -${4 * intensity}px ${
        8 * intensity
      }px ${light}`,
    };
  }
  return {
    backgroundColor: bg,
    shadowColor: dark,
    shadowOffset: { width: 0, height: 2 * intensity },
    shadowOpacity: 0.25 * intensity,
    shadowRadius: 4 * intensity,
    elevation: 1,
  };
}

/** Soft floating shadow for cards, modals, bottom sheets. */
export function neuFloat(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  const dark = `rgba(31, 35, 40, ${0.08 * intensity})`;
  if (isWeb) {
    return {
      backgroundColor: bg,
      boxShadow: `0px ${6 * intensity}px ${18 * intensity}px ${dark}`,
    };
  }
  return {
    backgroundColor: bg,
    shadowColor: dark,
    shadowOffset: { width: 0, height: 4 * intensity },
    shadowOpacity: 1,
    shadowRadius: 12 * intensity,
    elevation: 6 * intensity,
  };
}

/** Small shadow for buttons, chips, inputs. */
export function neuSoft(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  const dark = `rgba(174, 178, 192, ${0.4 * intensity})`;
  const light = "rgba(255, 255, 255, 0.8)";
  if (isWeb) {
    return {
      backgroundColor: bg,
      boxShadow: `${3 * intensity}px ${3 * intensity}px ${
        6 * intensity
      }px ${dark}, -${3 * intensity}px -${3 * intensity}px ${
        6 * intensity
      }px ${light}`,
    };
  }
  return {
    backgroundColor: bg,
    shadowColor: dark,
    shadowOffset: { width: 2 * intensity, height: 2 * intensity },
    shadowOpacity: 1,
    shadowRadius: 4 * intensity,
    elevation: 3 * intensity,
  };
}

/** Pressed / active state for a soft button. */
export function neuPressed(
  bg: string = Colors.bg.surface,
  intensity: number = 1,
): ViewStyle {
  return neuInset(bg, intensity);
}

/** Brand accent surface with soft tinted shadow. */
export function neuAccent(intensity: number = 1): ViewStyle {
  const dark = `rgba(217, 154, 10, ${0.35 * intensity})`;
  const light = "rgba(255, 255, 255, 0.8)";
  if (isWeb) {
    return {
      backgroundColor: Colors.brand.primary,
      boxShadow: `${3 * intensity}px ${3 * intensity}px ${
        8 * intensity
      }px ${dark}, -${3 * intensity}px -${3 * intensity}px ${
        8 * intensity
      }px ${light}`,
    };
  }
  return {
    backgroundColor: Colors.brand.primary,
    shadowColor: dark,
    shadowOffset: { width: 0, height: 3 * intensity },
    shadowOpacity: 1,
    shadowRadius: 8 * intensity,
    elevation: 5 * intensity,
  };
}

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

export const Neu = {
  raised: neuRaised,
  inset: neuInset,
  float: neuFloat,
  soft: neuSoft,
  pressed: neuPressed,
  accent: neuAccent,
  SHADOW_DARK,
  SHADOW_LIGHT,
};

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
