import { useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SuccessState({ title, subtitle, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: c.text.primary,
    },
    subtitle: {
      fontSize: 14,
      color: c.text.secondary,
      marginTop: 12,
      textAlign: "center",
    },
  });
