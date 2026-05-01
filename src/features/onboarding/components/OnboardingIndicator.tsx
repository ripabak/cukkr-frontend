import React from "react";
import { StyleSheet, View } from "react-native";
import { OnboardingTheme } from "../onboarding-theme";

interface OnboardingIndicatorProps {
  current: number;
  total: number;
  color?: string;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  current,
  total,
  color = OnboardingTheme.colors.dark,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: color },
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
    gap: OnboardingTheme.spacing.xs,
    marginTop: OnboardingTheme.spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: OnboardingTheme.borderRadius.full,
    opacity: 0.3,
  },
  dotActive: {
    width: 22,
    borderRadius: OnboardingTheme.borderRadius.full,
    opacity: 1,
  },
});

export default OnboardingIndicator;
