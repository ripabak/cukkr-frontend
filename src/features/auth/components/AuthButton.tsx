import { Pressable, StyleSheet, Text } from 'react-native';

import { authTheme } from '../auth-theme';

type AuthButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export function AuthButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' ? styles.secondaryLabel : styles.primaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: authTheme.radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: authTheme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: authTheme.colors.accent,
  },
  secondaryButton: {
    backgroundColor: authTheme.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: authTheme.colors.accent,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryLabel: {
    color: authTheme.colors.accentText,
  },
  secondaryLabel: {
    color: authTheme.colors.accent,
  },
});
