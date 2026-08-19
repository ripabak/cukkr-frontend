import { Neu } from "@/src/theme/styles";
import { useTheme } from "@/src/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
}

export function BackButton({ onPress, style }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.button, Neu.soft(colors.bg.surface, 0.8), style]}
    >
      <Ionicons
        name="chevron-back-outline"
        size={24}
        color={colors.text.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    height: 52,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
