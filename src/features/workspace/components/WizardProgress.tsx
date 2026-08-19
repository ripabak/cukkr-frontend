import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  totalSteps: number;
  currentStep: number;
  style?: ViewStyle;
}

export function WizardProgress({ totalSteps, currentStep, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            i <= currentStep - 1 ? styles.active : styles.upcoming,
          ]}
        />
      ))}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 8,
    },
    step: {
      flex: 1,
      height: 6,
      borderRadius: 999,
    },
    active: {
      backgroundColor: c.brand.primary,
    },
    upcoming: {
      backgroundColor: c.border.default,
    },
  });
