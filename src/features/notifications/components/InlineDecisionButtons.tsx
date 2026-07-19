import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
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
  const resolvedDecline = declineLabel ?? t("bookings.actionDecline");
  const resolvedAccept = acceptLabel ?? t("bookings.actionAccept");
  return (
    <View style={[styles.row, style]}>
      <TouchableOpacity
        onPress={onDecline}
        activeOpacity={0.8}
        style={[styles.btn, styles.declineBtn]}
      >
        <AppText style={styles.declineLabel}>{resolvedDecline}</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAccept}
        activeOpacity={0.8}
        style={[styles.btn, styles.acceptBtn]}
      >
        <AppText style={styles.acceptLabel}>{resolvedAccept}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.status.danger,
  },
  acceptBtn: {
    borderWidth: 1.5,
    borderColor: Colors.status.success,
  },
  declineLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.status.danger,
  },
  acceptLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.status.success,
  },
});
