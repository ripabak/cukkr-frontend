import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function ToggleSwitch({ value, onValueChange, disabled, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.track,
        value ? styles.trackOn : styles.trackOff,
        disabled && styles.trackDisabled,
        style,
      ]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff, Neu.soft(colors.bg.surface)]} />
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    track: {
      width: 48,
      height: 26,
      borderRadius: 13,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    trackOn: {
      backgroundColor: c.brand.primary,
    },
    trackOff: {
      backgroundColor: c.border.default,
    },
    trackDisabled: {
      opacity: 0.5,
    },
    thumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
    },
    thumbOn: {
      alignSelf: "flex-end",
    },
    thumbOff: {
      alignSelf: "flex-start",
    },
  });
