import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { ToggleSwitch } from "@/src/components/ToggleSwitch";

interface Props {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function ToggleRow({
  label,
  value,
  onValueChange,
  isLast,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, !isLast && styles.borderBottom, style]}>
      <AppText style={styles.label}>{label}</AppText>
      <ToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: c.border.light,
    },
    label: {
      flex: 1,
      fontWeight: "600",
      fontSize: 14,
      color: c.text.primary,
    },
  });
