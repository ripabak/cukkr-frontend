import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function DangerButton({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.button, Neu.soft(Colors.bg.surface, 0.9), style]}
    >
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: 16,
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.status.danger,
    textAlign: "center",
  },
});
