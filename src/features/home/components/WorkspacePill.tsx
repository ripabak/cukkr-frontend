import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  name: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function WorkspacePill({ name, onPress, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.container, Neu.soft(colors.bg.surface), style]}
    >
      <AppText style={styles.name} numberOfLines={1}>
        {name}
      </AppText>
      <Ionicons
        name="chevron-down"
        size={16}
        color={colors.icon.muted}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    maxWidth: 220,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
    flex: 1,
  },
  icon: {
    marginLeft: 4,
    flexShrink: 0,
  },
  });
