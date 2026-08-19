import React from "react";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { buildOnboardingTheme } from "../onboarding-theme";

interface OnboardingContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
};

const createStyles = (c: ThemeColors) => {
  const theme = buildOnboardingTheme(c);
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightBg,
    justifyContent: "center",
    alignItems: "center",
  },
  });
};

export default OnboardingContainer;
