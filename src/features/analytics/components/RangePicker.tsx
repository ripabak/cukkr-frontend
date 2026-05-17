import { Colors } from "@/src/theme/colors";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { AnalyticsRange } from "../services/analytics.service";

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "6m", label: "6 Mo" },
  { value: "1y", label: "1 Year" },
];

interface Props {
  value: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
}

export function RangePicker({ value, onChange }: Props) {
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
              activeOpacity={0.75}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  pillActive: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  pillTextActive: {
    color: Colors.text.primary,
  },
});
