import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  icon?: string;
  style?: ViewStyle;
}

export function GradientButton({ label, onPress, icon, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      <AppText style={styles.label}>{label}</AppText>
      {icon === "login" ? (
        <Ionicons name="log-in-outline" size={20} color={colors.text.primary} />
      ) : null}
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.brand.primary,
      borderRadius: 999,
      height: 56,
      width: "100%",
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: c.text.primary,
    },
  });
