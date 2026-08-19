import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
}

export function FloatingActionButton({ onPress, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.btn, Neu.accent(1.2), style]}
    >
      <Ionicons name="send" size={20} color={colors.text.primary} />
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    btn: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
    },
  });
