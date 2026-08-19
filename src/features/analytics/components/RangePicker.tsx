import { useI18nContext } from "@/src/lib/i18n/provider";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { AnalyticsRange } from "../services/analytics.service";

interface Props {
  value: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
}

export function RangePicker({ value, onChange }: Props) {
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
    { value: "24h", label: t("analytics.ranges.24h") },
    { value: "week", label: t("analytics.ranges.week") },
    { value: "month", label: t("analytics.ranges.month") },
    { value: "6m", label: t("analytics.ranges.6m") },
    { value: "1y", label: t("analytics.ranges.1y") },
  ];
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {RANGE_OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.85}
              style={[
                styles.pill,
                active ? Neu.accent(0.85) : Neu.soft(colors.bg.surface, 0.7),
              ]}
            >
              <AppText style={[styles.pillText, active && styles.pillTextActive]}>
                {opt.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      marginTop: 16,
      marginBottom: 4,
    },
    row: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 2,
    },
    pill: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 999,
    },
    pillText: {
      fontSize: 13,
      fontWeight: "500",
      color: c.text.secondary,
    },
    pillTextActive: {
      color: c.text.primary,
    },
  });
