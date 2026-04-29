import React from "react";
import { StyleSheet, View } from "react-native";
import { OnboardingTheme } from "../onboarding-theme";

interface OnboardingIndicatorProps {
  current: number;
  total: number;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  current,
  total,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === current && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: OnboardingTheme.spacing.sm,
    marginTop: OnboardingTheme.spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: OnboardingTheme.borderRadius.full,
    backgroundColor: OnboardingTheme.colors.white,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
  },
});

export default OnboardingIndicator;
