import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
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
  iconColor,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.card, Neu.raised(colors.bg.surface), style]}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.valueRow}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={iconColor ?? colors.brand.primary}
            style={styles.icon}
          />
        )}
        <AppText style={styles.value}>{value}</AppText>
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      padding: 16,
      flex: 1,
      gap: 6,
    },
    label: {
      fontSize: 12,
      color: c.icon.muted,
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
      fontWeight: "600",
      color: c.text.primary,
    },
  });
