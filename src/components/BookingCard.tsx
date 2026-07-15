import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type BookingStatus =
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "requested";
export type BookingType = "walk_in" | "appointment";

interface Props {
  customerName: string;
  barberName: string;
  timeLabel: string;
  duration: string;
  status: BookingStatus;
  bookingType?: BookingType;
  onPress?: () => void;
  style?: ViewStyle;
}

const STATUS_COLOR: Record<BookingStatus, string> = {
  waiting: Colors.status.waiting,
  in_progress: Colors.status.inProgress,
  completed: Colors.status.success,
  cancelled: Colors.status.danger,
  requested: Colors.brand.primaryDark,
};

const STATUS_ICON_BG: Record<BookingStatus, string> = {
  waiting: Colors.status.waitingSurface,
  in_progress: Colors.status.inProgressSurface,
  completed: Colors.status.successSurface,
  cancelled: Colors.status.dangerSurface,
  requested: Colors.brand.primarySurface,
};

export function BookingCard({
  customerName,
  barberName,
  timeLabel,
  duration,
  status,
  bookingType,
  onPress,
  style,
}: Props) {
  const color = STATUS_COLOR[status];
  const iconBg = STATUS_ICON_BG[status];
  const iconName =
    bookingType === "walk_in"
      ? "walk"
      : bookingType === "appointment"
        ? "calendar"
        : "people";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={22} color={color} />
      </View>
      <View style={styles.info}>
        <AppText style={styles.timeLabel}>{timeLabel}</AppText>
        <View style={styles.barberRow}>
          <Ionicons name="cut" size={12} color={Colors.icon.muted} />
          <AppText style={styles.barberName}> {barberName}</AppText>
        </View>
      </View>
      <View style={styles.right}>
        <AppText style={[styles.customerName, { color }]}>{customerName}</AppText>
        <AppText style={styles.duration}>{duration}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberName: {
    fontSize: 13,
    color: Colors.icon.muted,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
  },
  duration: {
    fontSize: 13,
    color: Colors.icon.muted,
  },
});
