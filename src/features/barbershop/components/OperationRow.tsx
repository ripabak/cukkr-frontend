import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function OperationRow({ label, onPress, isLast, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, !isLast && styles.borderBottom, style]}
    >
      <AppText style={styles.label}>{label}</AppText>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.icon.muted}
      />
    </TouchableOpacity>
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
      fontWeight: "600",
      fontSize: 14,
      color: c.text.primary,
      flex: 1,
    },
  });
