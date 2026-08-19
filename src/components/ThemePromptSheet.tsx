import { useI18nContext } from "@/src/lib/i18n/provider";
import { authClient } from "@/src/lib/auth-client";
import { useTheme } from "@/src/theme/ThemeContext";
import React from "react";
import { ThemePickerSheet } from "./ThemePickerSheet";

/**
 * First-run prompt — appears once right after a successful login (or when the
 * app opens already signed-in) and is REQUIRED: the user must pick a theme
 * (light / dark / system) before continuing. It cannot be dismissed — every
 * close path (scrim / drag / hardware back) is blocked until a choice is made,
 * so if the app is killed without choosing it simply reappears next launch.
 */
export function ThemePromptSheet() {
  const { t } = useI18nContext();
  const { hydrated, hasChosen } = useTheme();
  const { data: session } = authClient.useSession();

  const signedIn = Boolean(session);
  const visible = hydrated && !hasChosen && signedIn;

  return (
    <ThemePickerSheet
      visible={visible}
      mandatory
      title={t("profile.themePromptTitle")}
      subtitle={t("profile.themePromptSubtitle")}
    />
  );
}
