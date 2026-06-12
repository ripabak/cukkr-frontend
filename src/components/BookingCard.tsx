import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
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
        <Text style={styles.timeLabel}>{timeLabel}</Text>
        <View style={styles.barberRow}>
          <Ionicons name="cut" size={12} color={Colors.icon.muted} />
          <Text style={styles.barberName}> {barberName}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.customerName, { color }]}>{customerName}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberName: {
    fontSize: 12,
    color: Colors.icon.muted,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  customerName: {
    fontSize: 13,
    fontWeight: "600",
  },
  duration: {
    fontSize: 12,
    color: Colors.icon.muted,
  },
});
