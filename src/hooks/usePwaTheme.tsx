import { Colors } from "@/src/theme/colors";
import { useTheme } from "@/src/theme/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Dynamically sync the PWA / native status bar chrome with the app theme.
 *
 * Web (PWA): keeps `meta[name="theme-color"]`,
 * `apple-mobile-web-app-status-bar-style` and the root element background in
 * sync so the browser chrome, address bar and iOS status bar always match the
 * screen behind them (including on route changes and sheet overlays).
 *
 * Native: renders an `expo-status-bar` with the matching background color.
 */

const STATUS_BAR_STYLE_META = "apple-mobile-web-app-status-bar-style";

function applyWebTheme(color: string): void {
  if (typeof document === "undefined") return;

  const setMeta = (name: string, content: string) => {
    let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  setMeta("theme-color", color);
  // iOS always paints a black translucent status bar over our background —
  // the page background itself provides the visible "bar" color.
  setMeta(STATUS_BAR_STYLE_META, "black-translucent");

  const root = document.documentElement;
  root.style.backgroundColor = color;
  document.body.style.backgroundColor = color;
}

interface UsePwaThemeOptions {
  /** Background color behind the status bar / browser chrome. */
  color?: string;
  /** Icon/text contrast on that background. */
  barStyle?: "light" | "dark";
}

/**
 * Hook: sync chrome theme. Call from any screen to override the default.
 */
export function usePwaTheme({
  color = Colors.bg.default,
  barStyle = "dark",
}: UsePwaThemeOptions = {}): void {
  useEffect(() => {
    if (Platform.OS !== "web") return;
    applyWebTheme(color);
  }, [color]);

  // Bar style only matters on native.
  void barStyle;
}

/**
 * Component: mount once at a layout root to keep the chrome in sync.
 * Renders an expo-status-bar on native; manages meta tags on web.
 */
export function PwaStatusBar({
  color,
  barStyle,
}: UsePwaThemeOptions = {}) {
  const { colors, isDark } = useTheme();
  const resolvedColor = color ?? colors.bg.default;
  const resolvedStyle = barStyle ?? (isDark ? "light" : "dark");

  usePwaTheme({ color: resolvedColor });

  if (Platform.OS === "web") return null;
  return (
    <StatusBar style={resolvedStyle} backgroundColor={resolvedColor} />
  );
}
