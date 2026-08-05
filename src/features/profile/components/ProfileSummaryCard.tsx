import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ProfileSummaryCard({ children, style }: Props) {
  return <View style={[styles.card, Neu.raised(Colors.bg.surface), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
});
