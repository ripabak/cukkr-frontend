import { getStatusColor, getStatusSurface } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

type StatusVariant =
  | "active"
  | "pending"
  | "waiting"
  | "in_progress"
  | "completed"
  | "canceled"
  | "requested"
  | "declined"
  | "default";

interface Props {
  label: string;
  variant?: StatusVariant;
  style?: ViewStyle;
}

const STATUS_COLORS = (c: ThemeColors): Record<StatusVariant, string> => ({
  active: c.status.success,
  pending: c.status.warning,
  waiting: getStatusColor("waiting"),
  in_progress: getStatusColor("in_progress"),
  completed: getStatusColor("completed"),
  canceled: getStatusColor("cancelled"),
  requested: getStatusColor("requested"),
  declined: getStatusColor("declined"),
  default: c.text.secondary,
});

const STATUS_SURFACES = (c: ThemeColors): Record<StatusVariant, string> => ({
  active: c.status.successSurface,
  pending: c.status.warningSurface,
  waiting: getStatusSurface("waiting"),
  in_progress: getStatusSurface("in_progress"),
  completed: getStatusSurface("completed"),
  canceled: getStatusSurface("cancelled"),
  requested: getStatusSurface("requested"),
  declined: getStatusSurface("declined"),
  default: c.bg.surface,
});

export function StatusBadge({ label, variant = "default", style }: Props) {
  const { colors } = useTheme();
  const color = STATUS_COLORS(colors)[variant];
  const surface = STATUS_SURFACES(colors)[variant];

  return (
    <View style={[styles.badge, { backgroundColor: surface, borderColor: color }, style]}>
      <AppText style={[styles.text, { color }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});
