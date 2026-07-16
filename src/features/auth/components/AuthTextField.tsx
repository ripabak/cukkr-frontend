import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";

import { authTheme } from "../auth-theme";

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
  const [isSecure, setIsSecure] = useState(Boolean(secureTextEntry));

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>

      <View style={styles.inputShell}>
        <AppTextInput
          placeholderTextColor={authTheme.colors.textSecondary}
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
              color={authTheme.colors.textSecondary}
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: authTheme.spacing.xs,
  },
  label: {
    color: authTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 54,
    borderWidth: 1,
    borderColor: authTheme.colors.border,
    borderRadius: authTheme.radius.input,
    backgroundColor: authTheme.colors.inputBackground,
    paddingHorizontal: authTheme.spacing.md,
  },
  input: {
    flex: 1,
    color: authTheme.colors.textPrimary,
    fontSize: 16,
    paddingVertical: authTheme.spacing.sm,
  },
  iconButton: {
    marginLeft: authTheme.spacing.sm,
  },
});
