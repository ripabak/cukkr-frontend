import React from "react";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { OnboardingTheme } from "../onboarding-theme";

interface OnboardingContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OnboardingTheme.colors.dark,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingContainer;
