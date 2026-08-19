import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { DayHoursRow } from "@/src/components/DayHoursRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  useOpenHours,
  useUpdateOpenHours,
} from "@/src/features/barbershop/hooks";
import {
  DAY_LABELS,
  DEFAULT_CLOSE,
  DEFAULT_OPEN,
  TimeValue,
  stringToTime,
  timeToString,
} from "@/src/utils/time-format";
import { useMemberRole } from "@/src/hooks";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

interface DayConfig {
  dayOfWeek: number;
  label: string;
  enabled: boolean;
  open: TimeValue;
  close: TimeValue;
}

const DEFAULT_DAYS: DayConfig[] = [1, 2, 3, 4, 5, 6, 0].map((day) => ({
  dayOfWeek: day,
  label: DAY_LABELS[day],
  enabled: day !== 0,
  open: DEFAULT_OPEN,
  close: DEFAULT_CLOSE,
}));

export function OpenHoursScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: apiDays } = useOpenHours();
  const { mutate: updateHours } = useUpdateOpenHours();
  const { role } = useMemberRole();
  const canManage = role === "owner" || role === "admin";
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [initialized, setInitialized] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const skipInitRef = useRef(false);

  useEffect(() => {
    if (apiDays && apiDays.length > 0 && !initialized) {
      skipInitRef.current = true;
      setDays((prev) =>
        prev.map((d) => {
          const api = apiDays.find((a) => a.dayOfWeek === d.dayOfWeek);
          if (!api) return d;
          return {
            ...d,
            enabled: api.isOpen,
            open: api.openTime ? stringToTime(api.openTime) : DEFAULT_OPEN,
            close: api.closeTime ? stringToTime(api.closeTime) : DEFAULT_CLOSE,
          };
        }),
      );
      setInitialized(true);
    }
  }, [apiDays, initialized]);

  const updateDay = (dayOfWeek: number, updates: Partial<DayConfig>) => {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...updates } : d)),
    );
  };

  const debouncedDays = useDebounce(days, 800);

  useEffect(() => {
    if (!initialized) return;
    if (skipInitRef.current) {
      skipInitRef.current = false;
      return;
    }

    const payload = debouncedDays.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      isOpen: d.enabled,
      openTime: d.enabled ? timeToString(d.open) : null,
      closeTime: d.enabled ? timeToString(d.close) : null,
    }));

    setSaveStatus("saving");
    updateHours(payload, {
      onSuccess: () => {
        setSaveStatus("saved");
      },
      onError: (e) => {
        toast.error(e.message || t("toast.unknownError"));
        setSaveStatus("idle");
      },
    });
  }, [debouncedDays]);

  return (
    <ScreenShell headerSlot={<ScreenHeader onBack={() => router.back()} />} contentStyle={{ paddingBottom: 200 }}>
      <AppText style={styles.title}>{t("barbershop.openHours")}</AppText>
      <AppText style={styles.subtitle}>
        {t("createBarbershop.openHoursSubtitle")}
      </AppText>

      <View style={[styles.card, Neu.raised(colors.bg.surface)]}>
        {days.map((day, index) => (
          <DayHoursRow
            key={day.dayOfWeek}
            day={day.label}
            enabled={day.enabled}
            onEnabledChange={(v) => updateDay(day.dayOfWeek, { enabled: v })}
            openTime={day.open}
            closeTime={day.close}
            onOpenTimeChange={(t) => updateDay(day.dayOfWeek, { open: t })}
            onCloseTimeChange={(t) => updateDay(day.dayOfWeek, { close: t })}
            editable={canManage}
            isLast={index === days.length - 1}
          />
        ))}
      </View>

      {canManage ? (
        saveStatus !== "idle" ? (
          <AppText style={styles.saveStatus}>
            {saveStatus === "saving" ? t("common.saving") : t("common.saved")}
          </AppText>
        ) : null
      ) : (
        <View style={styles.viewOnlyBanner}>
          <AppText style={styles.viewOnlyText}>{t("common.noPermission")}</AppText>
        </View>
      )}
    </ScreenShell>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: "600",
      color: c.text.primary,
      marginTop: 8,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: 14,
      color: c.text.secondary,
      marginTop: 4,
      marginBottom: 24,
    },
    card: {
      borderRadius: 20,
      marginBottom: 24,
    },
    saveStatus: {
      fontSize: 12,
      color: c.text.muted,
      textAlign: "center",
      marginBottom: 16,
    },
    viewOnlyBanner: {
      padding: 12,
      backgroundColor: c.bg.surface,
      borderRadius: 8,
      alignItems: "center",
    },
    viewOnlyText: {
      fontSize: 13,
      color: c.text.muted,
      textAlign: "center",
    },
  });
