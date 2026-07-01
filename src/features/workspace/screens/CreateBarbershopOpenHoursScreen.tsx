import { Colors } from "@/src/theme/colors";
import { DayHoursRow } from "@/src/components/DayHoursRow";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useToast } from "@/src/lib/providers";
import {
  DAY_LABELS,
  DEFAULT_CLOSE,
  DEFAULT_OPEN,
  TimeValue,
  timeToString,
} from "@/src/utils/time-format";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { openHoursService } from "../services";
import { getErrorMessage } from "../utils/error-handler";

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

export function CreateBarbershopOpenHoursScreen() {
  const router = useRouter();
  const toast = useToast();
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [isSaving, setIsSaving] = useState(false);

  const updateDay = (dayOfWeek: number, updates: Partial<DayConfig>) => {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...updates } : d)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const payload = days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        isOpen: d.enabled,
        openTime: d.enabled ? timeToString(d.open) : null,
        closeTime: d.enabled ? timeToString(d.close) : null,
      }));

      await openHoursService.update(payload);
      router.push("/d/create-barbershop-invite-barber-empty");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={2} currentStep={0} style={styles.wizard} />
      <Text style={styles.title}>Set Open Hours</Text>
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

      <View style={styles.flex} />
      <PrimaryButton
        label={isSaving ? "Saving..." : "Save & Continue"}
        onPress={handleSave}
        disabled={isSaving}
        style={styles.button}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wizard: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    marginBottom: 24,
  },
  flex: {
    flex: 1,
    minHeight: 32,
  },
  button: {
    marginBottom: 16,
  },
});
