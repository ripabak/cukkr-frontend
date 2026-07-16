import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
}

export function SecondaryButton({ label, onPress, style, color }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        color ? { borderColor: color } : undefined,
        style,
      ]}
    >
      <AppText style={[styles.label, color ? { color } : undefined]}>
        {label}
      </AppText>
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
