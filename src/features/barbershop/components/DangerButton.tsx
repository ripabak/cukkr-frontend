import { Colors } from "@/src/theme/colors";
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
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingVertical: 14,
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
  },
});
