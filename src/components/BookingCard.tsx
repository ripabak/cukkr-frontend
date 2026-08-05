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
import { Neu, Status, type BookingStatus } from "@/src/theme/styles";

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
  const statusStyle = Status.getStyle(status);
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
      style={[styles.card, Neu.raised(Colors.bg.surface), style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: statusStyle.surface }]}>
        <Ionicons name={iconName as any} size={22} color={statusStyle.color} />
      </View>
      <View style={styles.info}>
        <AppText style={styles.timeLabel}>{timeLabel}</AppText>
        <View style={styles.barberRow}>
          <Ionicons name="cut" size={12} color={Colors.icon.muted} />
          <AppText style={styles.barberName} numberOfLines={1} ellipsizeMode="tail">
            {" "}{barberName}
          </AppText>
        </View>
      </View>
      <View style={styles.right}>
        <AppText style={[styles.customerName, { color: statusStyle.color }]}>
          {customerName}
        </AppText>
        <AppText style={styles.duration}>{duration}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    gap: 14,
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
