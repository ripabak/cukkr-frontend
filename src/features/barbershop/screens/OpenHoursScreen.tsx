import { Colors } from "@/src/theme/colors";
import { DayHoursRow } from "@/src/features/barbershop/components/DayHoursRow";
import { PrimaryButton } from "@/src/components/PrimaryButton";
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
} from "@/src/features/barbershop/utils/time-format";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const { data: apiDays, isLoading } = useOpenHours();
  const { mutate: updateHours, isPending: isSaving } = useUpdateOpenHours();
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (apiDays && apiDays.length > 0 && !initialized) {
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

  const handleSave = () => {
    const payload = days.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      isOpen: d.enabled,
      openTime: d.enabled ? timeToString(d.open) : null,
      closeTime: d.enabled ? timeToString(d.close) : null,
    }));

    updateHours(payload, {
      onSuccess: () => {
        toast.success("Open hours saved");
        router.back();
      },
      onError: (e) => toast.error(e.message || "Failed to save open hours"),
    });
  };

  return (
    <ScreenShell headerSlot={<ScreenHeader onBack={() => router.back()} />}>
      <Text style={styles.title}>Open Hours</Text>
      <Text style={styles.subtitle}>
        Set your barbershop operating hours for each day
      </Text>

      <View style={styles.card}>
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
            isLast={index === days.length - 1}
          />
        ))}
      </View>

      <PrimaryButton
        label={isSaving ? "Saving..." : "Save Hours"}
        onPress={handleSave}
        disabled={isSaving || isLoading}
        style={styles.saveBtn}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    marginBottom: 24,
  },
  saveBtn: {},
});
