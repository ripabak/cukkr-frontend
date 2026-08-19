import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.button, Neu.soft(colors.bg.surface), style]}
    >
      <AppText style={[styles.label, color ? { color } : undefined]}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 999,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    label: {
      color: c.text.primary,
      fontSize: 16,
      fontWeight: "500",
    },
  });
