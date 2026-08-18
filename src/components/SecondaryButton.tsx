import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Neu } from "@/src/theme/styles";

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
      activeOpacity={0.85}
      style={[styles.button, Neu.soft(Colors.bg.surface), style]}
    >
      <AppText style={[styles.label, color ? { color } : undefined]}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
