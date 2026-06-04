import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SecondaryButton({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
