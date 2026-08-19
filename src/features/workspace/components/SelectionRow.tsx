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
  isActive?: boolean;
  style?: ViewStyle;
}

export function SelectionRow({
  label,
  onPress,
  isLast,
  isActive,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isActive ? 1 : 0.7}
      style={[styles.container, !isLast && styles.borderBottom, style]}
    >
      <AppText style={[styles.label, isActive && styles.labelDisabled]}>
        {label}
      </AppText>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isActive ? colors.icon.muted : colors.text.primary}
      />
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 18,
      paddingHorizontal: 8,
      width: "100%",
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0,0,0,0.08)",
    },
    label: {
      flex: 1,
      fontSize: 15,
      fontWeight: "500",
      color: c.text.primary,
    },
    labelDisabled: {
      color: c.icon.muted,
      fontWeight: "400",
    },
  });
