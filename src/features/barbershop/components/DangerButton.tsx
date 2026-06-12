import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

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
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFE4E4",
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E53E3E",
    textAlign: "center",
  },
});
