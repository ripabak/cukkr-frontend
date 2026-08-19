import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  title?: string;
  titleSlot?: React.ReactNode;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  titleSlot,
  onBack,
  rightAction,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, style]}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, Neu.soft(colors.bg.surface)]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      {titleSlot ? (
        <View style={styles.titleSpacer}>{titleSlot}</View>
      ) : title ? (
        <AppText style={styles.title}>{title}</AppText>
      ) : (
        <View style={styles.titleSpacer} />
      )}
      {rightAction ? (
        <View style={styles.rightSlot}>{rightAction}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholder: {
      width: 40,
      height: 40,
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "600",
      color: c.text.primary,
      letterSpacing: -0.3,
    },
    titleSpacer: {
      flex: 1,
    },
    rightSlot: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
