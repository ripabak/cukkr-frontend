import React from "react";
import { AppText } from "@/src/components/AppText";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { buildOnboardingTheme } from "../onboarding-theme";

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
  const { colors } = useTheme();
  const theme = buildOnboardingTheme(colors);
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary
          ? Neu.soft(theme.colors.white)
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

const createStyles = (c: ThemeColors) => {
  const theme = buildOnboardingTheme(c);
  return StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.dark,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: theme.colors.dark,
  },
  });
};

export default OnboardingButton;
