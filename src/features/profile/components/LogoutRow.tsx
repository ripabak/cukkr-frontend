import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useI18nContext } from "@/src/lib/i18n/provider";

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
}

export function LogoutRow({ onPress, style }: Props) {
  const { t } = useI18nContext();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.container, Neu.raised(Colors.status.dangerSurface, 1.1), style]}
    >
      <AppText style={styles.label}>{t("common.logout")}</AppText>
      <Ionicons name="exit-outline" size={20} color={Colors.status.danger} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.status.danger,
  },
});
