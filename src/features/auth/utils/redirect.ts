import type { Href } from "expo-router";
import { Platform } from "react-native";

/**
 * Nilai query param dari kanal yang terpercaya.
 * Web: URL bar adalah sumber kebenaran — route param bisa ter-hydrate ASYNC
 * dan kadang tertinggal di render pertama. Langsung baca `window.location`.
 * Native: ambil dari route params (satu-satunya sumber di sana).
 */
export function getUrlParam(
  name: string,
  routeValue: string | string[] | undefined
): string | undefined {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const fromUrl = new URLSearchParams(window.location.search).get(name);
    if (fromUrl) return fromUrl;
  }
  return Array.isArray(routeValue) ? routeValue[0] : routeValue;
}

/**
 * Resolve & normalisasi redirect target dari URL `?callbackURL=` dengan aman.
 *
 * - Menolak path non-internal (URL absolut / protocol-relative) → mencegah open redirect.
 * - Menormalkan query string menjadi params object → robust di web & native
 *   (menghindari quirk parsing string href yang mengandung `?`).
 * - Mengembalikan null untuk value undefined/null/""/tidak valid →
 *   pemanggil cukup fallback ke home (`` "" ?? home `` TIDAK trigger fallback).
 */
export function resolveRedirect(
  redirect: string | string[] | undefined
): Href | null {
  const raw = Array.isArray(redirect) ? redirect[0] : redirect;
  if (!raw) return null;
  // Hanya path internal — tolak "https://...", "//evil.com", dst (open redirect).
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  const [pathname, search = ""] = raw.split("?");
  if (!pathname || pathname === "/") return null;
  const params: Record<string, string> = {};
  if (search) {
    for (const pair of search.split("&")) {
      const [key, ...rest] = pair.split("=");
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(rest.join("="));
    }
  }
  // Path dinamis tidak bisa dinyatakan sebagai literal typed route → cast ke Href.
  return { pathname, params } as Href;
}