import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  totalSteps: number;
  currentStep: number;
  style?: ViewStyle;
}

export function WizardProgress({ totalSteps, currentStep, style }: Props) {
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

const styles = StyleSheet.create({
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
    backgroundColor: Colors.brand.primary,
  },
  upcoming: {
    backgroundColor: Colors.border.default,
  },
});
