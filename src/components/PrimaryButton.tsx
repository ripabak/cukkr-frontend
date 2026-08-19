import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, disabled, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.button,
        Neu.accent(),
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppText style={styles.label}>{label}</AppText>
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
    disabled: {
      opacity: 0.5,
    },
    label: {
      color: c.text.primary,
      fontSize: 16,
      fontWeight: "600",
    },
  });
