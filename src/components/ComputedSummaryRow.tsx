import { AppText } from "@/src/components/AppText";
import { useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  label: string;
  value: string;
  style?: ViewStyle;
}

export function ComputedSummaryRow({ label, value, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.divider} />
      <View style={styles.row}>
        <AppText style={styles.label}>{label}</AppText>
        <AppText style={styles.value}>{value}</AppText>
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {},
    divider: {
      height: 1,
      backgroundColor: c.border.light,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    label: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      color: c.text.primary,
    },
    value: {
      fontSize: 14,
      fontWeight: "600",
      color: c.text.primary,
    },
  });
