import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  value: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  iconName,
  iconColor = Colors.brand.primary,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.valueRow}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <AppText style={styles.value}>{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    flex: 1,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: Colors.icon.muted,
    fontWeight: "500",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {},
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
