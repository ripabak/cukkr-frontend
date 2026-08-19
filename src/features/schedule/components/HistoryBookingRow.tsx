import { BookingType } from "@/src/components/BookingCard";
import { BookingStatus, Status, Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  customerName: string;
  barberName: string;
  dateTimeLabel: string;
  duration: string;
  status: BookingStatus;
  bookingType?: BookingType;
  onPress?: () => void;
  style?: ViewStyle;
}

export function HistoryBookingRow({
  customerName,
  barberName,
  dateTimeLabel,
  duration,
  status,
  bookingType,
  onPress,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
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
      style={[styles.row, Neu.raised(colors.bg.surface), style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: statusStyle.surface }]}>
        <Ionicons name={iconName as any} size={20} color={statusStyle.color} />
      </View>
      <View style={styles.info}>
        <AppText style={styles.dateTime} numberOfLines={1}>
          {dateTimeLabel}
        </AppText>
        <View style={styles.barberRow}>
          <Ionicons name="cut" size={12} color={colors.icon.muted} />
          <AppText style={styles.barberName}> {barberName}</AppText>
        </View>
      </View>
      <View style={styles.right}>
        <AppText style={[styles.customerName, { color: statusStyle.color }]}>{customerName}</AppText>
        <AppText style={styles.duration}>{duration}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    gap: 12,
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
  dateTime: {
    fontSize: 13,
    fontWeight: "500",
    color: c.text.primary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberName: {
    fontSize: 12,
    color: c.icon.muted,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  customerName: {
    fontSize: 13,
    fontWeight: "500",
  },
  duration: {
    fontSize: 12,
    color: c.icon.muted,
  },
  });
