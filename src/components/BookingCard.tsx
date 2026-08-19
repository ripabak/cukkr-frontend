import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  Neu,
  Status,
  useThemedStyles,
  type BookingStatus,
} from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";

export type BookingType = "walk_in" | "appointment";

interface Props {
  customerName: string;
  barberName: string;
  timeLabel: string;
  duration: string;
  status: BookingStatus;
  bookingType?: BookingType;
  /** True when the displayed barber is the currently logged-in user. */
  barberIsYou?: boolean;
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
  barberIsYou,
  onPress,
  style,
}: Props) {
  const { t } = useI18nContext();
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
      style={[styles.card, Neu.raised(colors.bg.surface), style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: statusStyle.surface }]}>
        <Ionicons name={iconName as any} size={22} color={statusStyle.color} />
      </View>
      <View style={styles.info}>
        <AppText style={styles.timeLabel}>{timeLabel}</AppText>
        <View style={styles.barberRow}>
          <Ionicons name="cut" size={12} color={colors.icon.muted} />
          <AppText style={styles.barberName} numberOfLines={1} ellipsizeMode="tail">
            {" "}{barberName}
          </AppText>
          {barberIsYou ? (
            <View style={styles.youPill}>
              <AppText style={styles.youPillText}>{t("bookings.you")}</AppText>
            </View>
          ) : null}
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

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
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
      fontWeight: "500",
      color: c.text.primary,
    },
    barberRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    barberName: {
      fontSize: 13,
      color: c.icon.muted,
    },
    youPill: {
      backgroundColor: c.brand.primarySurface,
      borderRadius: 6,
      paddingHorizontal: 5,
      paddingVertical: 1,
      marginLeft: 6,
    },
    youPillText: {
      fontSize: 9.5,
      fontWeight: "600",
      color: c.brand.text,
    },
    right: {
      alignItems: "flex-end",
      gap: 2,
    },
    customerName: {
      fontSize: 14,
      fontWeight: "500",
    },
    duration: {
      fontSize: 13,
      color: c.icon.muted,
    },
  });
