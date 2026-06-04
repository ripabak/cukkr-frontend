import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, disabled, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
