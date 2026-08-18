import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export function StickyCta({
  label,
  onPress,
  color = Colors.brand.primary,
  textColor = Colors.text.primary,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.cta, Neu.accent(1.1), { backgroundColor: color }, style]}
    >
      <AppText style={[styles.label, { color: textColor }]}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cta: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
