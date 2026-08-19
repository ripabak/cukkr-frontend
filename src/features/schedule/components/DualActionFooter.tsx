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

export function DualActionFooter({
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
    <View style={[styles.footer, style]}>
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
        style={[styles.btn, Neu.accent()]}
      >
        <AppText style={styles.acceptLabel}>{resolvedAccept}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: c.bg.default,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  declineLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: c.status.danger,
  },
  acceptLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: c.text.primary,
  },
  });
