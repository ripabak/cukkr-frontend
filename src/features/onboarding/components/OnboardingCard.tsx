import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Neu } from "@/src/theme/styles";
import { OnboardingTheme } from "../onboarding-theme";

interface OnboardingCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.card, Neu.raised(OnboardingTheme.colors.white, 1.1), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: OnboardingTheme.colors.white,
    borderRadius: OnboardingTheme.borderRadius.xl,
    padding: OnboardingTheme.spacing.lg,
    width: "90%",
    maxWidth: 380,
    minHeight: 500,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default OnboardingCard;
