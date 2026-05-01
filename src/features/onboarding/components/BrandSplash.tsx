import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { OnboardingTheme } from "../onboarding-theme";

interface BrandSplashProps {
  style?: ViewStyle;
}

export const BrandSplash: React.FC<BrandSplashProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.wordmark}>Cukkr</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4E8",
    justifyContent: "center",
    alignItems: "center",
  },
  wordmark: {
    fontSize: 32,
    fontWeight: "700",
    color: OnboardingTheme.colors.textDark,
    letterSpacing: 0.5,
  },
});

export default BrandSplash;
