import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function DangerButton({ label, onPress, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.button, Neu.soft(colors.bg.surface, 0.9), style]}
    >
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 999,
      paddingVertical: 16,
      width: "100%",
    },
    label: {
      fontSize: 15,
      fontWeight: "500",
      color: c.status.danger,
      textAlign: "center",
    },
  });
