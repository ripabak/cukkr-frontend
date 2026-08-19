import { useI18nContext } from "@/src/lib/i18n/provider";
import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props {
  declineLabel?: string;
  acceptLabel?: string;
  onDecline?: () => void;
  onAccept?: () => void;
  style?: ViewStyle;
}

export function InlineDecisionButtons({
  declineLabel,
  acceptLabel,
  onDecline,
  onAccept,
  style,
}: Props) {
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const resolvedDecline = declineLabel ?? t("bookings.actionDecline");
  const resolvedAccept = acceptLabel ?? t("bookings.actionAccept");
  return (
    <View style={[styles.row, style]}>
      <TouchableOpacity
        onPress={onDecline}
        activeOpacity={0.85}
        style={[styles.btn, Neu.soft(colors.bg.surface)]}
      >
        <AppText style={styles.declineLabel}>{resolvedDecline}</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAccept}
        activeOpacity={0.85}
        style={[styles.btn, Neu.accent(0.85)]}
      >
        <AppText style={styles.acceptLabel}>{resolvedAccept}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  declineLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: c.status.danger,
  },
  acceptLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.text.primary,
  },
  });
