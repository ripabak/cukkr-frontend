/**
 * Cross-platform tactile haptics.
 *
 * Web: uses the Vibration API (`navigator.vibrate`) — works in Chromium /
 * Android WebView PWAs when triggered from a user gesture.
 * Native: uses React Native's `Vibration` module.
 *
 * Every function is a safe no-op when the API is unavailable (e.g. iOS Safari).
 * Keep patterns short — haptics should feel like ticks, not ringtones.
 */
import { Platform, Vibration } from "react-native";

function canVibrate(): boolean {
  if (Platform.OS === "web") {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    );
  }
  return true;
}

function vibrate(pattern: number | number[]): void {
  if (!canVibrate()) return;
  try {
    if (Platform.OS === "web") {
      navigator.vibrate(pattern);
    } else {
      Vibration.vibrate(pattern as number, false);
    }
  } catch {
    // Haptics are decorative — never let them break interactions.
  }
}

export const haptics = {
  /** Tick for selection / tap. */
  light: () => vibrate(8),
  /** Noticeable tap for primary actions. */
  medium: () => vibrate(15),
  /** Strong confirmation. */
  heavy: () => vibrate([0, 22, 40, 24]),
  /** Subtle picker tick. */
  selection: () => vibrate(6),
  /** Positive completion (success toast, PIN generated). */
  success: () => vibrate([0, 12, 32, 18]),
  /** Warning (error toast, destructive action). */
  warning: () => vibrate([0, 20, 40, 30]),
} as const;

export type HapticKind = keyof typeof haptics;
