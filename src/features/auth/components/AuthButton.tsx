import { Neu } from "@/src/theme/styles";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";

import { authTheme } from "../auth-theme";

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
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" ? Neu.soft(authTheme.colors.cardBackground) : Neu.accent(0.9),
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

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: authTheme.radius.pill,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: authTheme.spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  primaryLabel: {
    color: authTheme.colors.accentText,
  },
  secondaryLabel: {
    color: authTheme.colors.accent,
  },
});
