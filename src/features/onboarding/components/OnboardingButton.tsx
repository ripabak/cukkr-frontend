import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { OnboardingTheme } from '../onboarding-theme';

interface OnboardingButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[styles.button, isSecondary && styles.buttonSecondary, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, isSecondary && styles.buttonTextSecondary, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: OnboardingTheme.colors.primary,
    paddingVertical: OnboardingTheme.spacing.md,
    paddingHorizontal: OnboardingTheme.spacing.lg,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginTop: OnboardingTheme.spacing.md,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: OnboardingTheme.colors.dark,
  },
  buttonText: {
    color: OnboardingTheme.colors.dark,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextSecondary: {
    color: OnboardingTheme.colors.dark,
  },
});

export default OnboardingButton;
