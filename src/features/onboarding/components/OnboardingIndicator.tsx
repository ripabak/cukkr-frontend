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
            index === current ? styles.dotActive : styles.dotInactive,
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
    height: 6,
    borderRadius: OnboardingTheme.borderRadius.full,
  },
  dotInactive: {
    width: 6,
    backgroundColor: OnboardingTheme.colors.dark,
    opacity: 0.2,
  },
  dotActive: {
    width: 22,
    backgroundColor: OnboardingTheme.colors.primary,
    opacity: 1,
  },
});

export default OnboardingIndicator;
