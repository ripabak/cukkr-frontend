import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { buildOnboardingTheme } from "../onboarding-theme";

interface OnboardingCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  children,
  style,
}) => {
  const { colors } = useTheme();
  const theme = buildOnboardingTheme(colors);
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.card, Neu.raised(theme.colors.white, 1.1), style]}>{children}</View>;
};

const createStyles = (c: ThemeColors) => {
  const theme = buildOnboardingTheme(c);
  return StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: "90%",
    maxWidth: 380,
    minHeight: 500,
    justifyContent: "space-between",
    alignItems: "center",
  },
  });
};

export default OnboardingCard;
