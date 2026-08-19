import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
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
  color,
  textColor,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const bg = color ?? colors.brand.primary;
  const fg = textColor ?? colors.text.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.cta, Neu.accent(1.1), { backgroundColor: bg }, style]}
    >
      <AppText style={[styles.label, { color: fg }]}>{label}</AppText>
    </TouchableOpacity>
  );
}

const createStyles = (_c: ThemeColors) =>
  StyleSheet.create({
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
