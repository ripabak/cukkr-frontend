import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { ToggleSwitch } from "@/src/components/ToggleSwitch";

interface Props {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function ToggleRow({
  label,
  value,
  onValueChange,
  isLast,
  style,
}: Props) {
  return (
    <View style={[styles.container, !isLast && styles.borderBottom, style]}>
      <AppText style={styles.label}>{label}</AppText>
      <ToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  label: {
    flex: 1,
    fontWeight: "700",
    fontSize: 14,
    color: Colors.text.primary,
  },
});
