import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function DateSelectorPill({ label, onPress, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.pill, Neu.soft(colors.bg.surface), style]}
    >
      <Ionicons
        name="calendar-outline"
        size={16}
        color={colors.text.primary}
        style={styles.icon}
      />
      <AppText style={styles.label}>{label}</AppText>
      <Ionicons
        name="chevron-down"
        size={14}
        color={colors.text.primary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: c.text.primary,
  },
  chevron: {
    marginLeft: 8,
  },
  });
