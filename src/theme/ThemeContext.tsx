import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Colors } from "./colors";
import { DarkColors } from "./darkColors";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "cukkr_theme_mode";
const VALID = ["light", "dark", "system"] as const;

/** Palette type with widened `string` values so light & dark both satisfy it. */
type Widen<T> = { [K in keyof T]: T[K] extends object ? Widen<T[K]> : string };
export type ThemeColors = Widen<typeof Colors>;

export interface ThemeContextValue {
  /** User preference. Defaults to "light". */
  mode: ThemeMode;
  /** What is actually applied ("system" resolves against the OS scheme). */
  resolved: ResolvedTheme;
  isDark: boolean;
  /** Active palette (light or dark mirror of `Colors`). */
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  /** True once the persisted preference has been read from storage. */
  hydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate the persisted preference before first paint to avoid a
  // light → dark flash on app start.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!cancelled && VALID.includes(stored as ThemeMode)) {
          setModeState(stored as ThemeMode);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue | null>(() => {
    if (!hydrated) return null;
    const resolved: ResolvedTheme =
      mode === "system"
        ? systemScheme === "dark"
          ? "dark"
          : "light"
        : mode;
    const isDark = resolved === "dark";
    return {
      mode,
      resolved,
      isDark,
      colors: isDark ? DarkColors : Colors,
      setMode,
      hydrated,
    };
  }, [hydrated, mode, systemScheme, setMode]);

  if (!value) return null; // block first frame until preference is known

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
