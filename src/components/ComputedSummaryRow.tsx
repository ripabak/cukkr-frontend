import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  value: string;
  style?: ViewStyle;
}

export function ComputedSummaryRow({ label, value, style }: Props) {
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

const styles = StyleSheet.create({
  container: {},
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
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
    fontWeight: "600",
    color: Colors.text.primary,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
