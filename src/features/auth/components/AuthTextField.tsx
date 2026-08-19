import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  type TextInputProps,
  View,
} from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";

import { authRadius, authSpacing } from "../auth-theme";

type AuthTextFieldProps = TextInputProps & {
  label: string;
  secureToggle?: boolean;
};

export function AuthTextField({
  label,
  secureTextEntry,
  secureToggle = false,
  style,
  ...props
}: AuthTextFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>

      <View style={[styles.inputShell, Neu.inset(colors.bg.surface, 0.6)]}>
        <AppTextInput
          placeholderTextColor={colors.text.secondary}
          style={[styles.input, style]}
          secureTextEntry={secureToggle ? isSecure : secureTextEntry}
          {...props}
        />

        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setIsSecure((current) => !current)}
            style={styles.iconButton}
          >
            <Ionicons
              color={colors.text.secondary}
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: authSpacing.xs,
    },
    label: {
      color: c.text.secondary,
      fontSize: 14,
      fontWeight: "500",
    },
    inputShell: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 54,
      borderRadius: authRadius.input,
      paddingHorizontal: authSpacing.md,
    },
    input: {
      flex: 1,
      color: c.text.primary,
      fontSize: 16,
      paddingVertical: authSpacing.sm,
    },
    iconButton: {
      marginLeft: authSpacing.sm,
    },
  });
