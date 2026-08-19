import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ProfileSummaryCard({ children, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.card, Neu.raised(colors.bg.surface), style]}>{children}</View>;
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  });
