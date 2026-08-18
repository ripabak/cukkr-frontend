import React from "react";
import { AppText } from "@/src/components/AppText";
import { Neu } from "@/src/theme/styles";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { OnboardingTheme } from "../onboarding-theme";

interface OnboardingButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  style,
  textStyle,
}) => {
  const isSecondary = variant === "secondary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary
          ? Neu.soft(OnboardingTheme.colors.white)
          : Neu.accent(0.9),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <AppText
        style={[
          styles.buttonText,
          isSecondary && styles.buttonTextSecondary,
          textStyle,
        ]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: OnboardingTheme.spacing.md,
    paddingHorizontal: OnboardingTheme.spacing.lg,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
    marginTop: OnboardingTheme.spacing.md,
  },
  buttonText: {
    color: OnboardingTheme.colors.dark,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: OnboardingTheme.colors.dark,
  },
});

export default OnboardingButton;
