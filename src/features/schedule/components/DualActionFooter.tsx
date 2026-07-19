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

export function DualActionFooter({
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
    <View style={[styles.footer, style]}>
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
    backgroundColor: Colors.bg.default,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.status.danger,
  },
  acceptBtn: {
    backgroundColor: Colors.brand.primary,
  },
  declineLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.status.danger,
  },
  acceptLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
