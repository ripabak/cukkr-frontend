import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { buildOnboardingTheme } from "../onboarding-theme";

interface OnboardingIndicatorProps {
  current: number;
  total: number;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  current,
  total,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
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

const createStyles = (c: ThemeColors) => {
  const theme = buildOnboardingTheme(c);
  return StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
  dot: {
    height: 6,
    borderRadius: theme.borderRadius.full,
  },
  dotInactive: {
    width: 6,
    backgroundColor: theme.colors.dark,
    opacity: 0.2,
  },
  dotActive: {
    width: 22,
    backgroundColor: theme.colors.primary,
    opacity: 1,
  },
  });
};

export default OnboardingIndicator;
