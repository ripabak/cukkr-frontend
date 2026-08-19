import { Neu, useThemedStyles } from "@/src/theme/styles";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";

import { authRadius, authSpacing } from "../auth-theme";

type AuthButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function AuthButton({
  label,
  onPress,
  variant = "primary",
  disabled,
}: AuthButtonProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" ? Neu.soft(colors.bg.surface) : Neu.accent(0.9),
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <AppText
        style={[
          styles.label,
          variant === "secondary" ? styles.secondaryLabel : styles.primaryLabel,
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    button: {
      minHeight: 56,
      borderRadius: authRadius.pill,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: authSpacing.lg,
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.5,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
    },
    primaryLabel: {
      color: c.text.primary,
    },
    secondaryLabel: {
      color: c.brand.primary,
    },
  });
