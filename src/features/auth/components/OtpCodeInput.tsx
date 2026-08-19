import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";

import { authRadius, authSpacing } from "../auth-theme";

type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export function OtpCodeInput({
  autoFocus = true,
  length = 4,
  onChange,
  value,
}: OtpCodeInputProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timeout);
  }, [autoFocus]);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.wrapper}>
      <AppTextInput
        autoFocus={autoFocus}
        keyboardType="number-pad"
        maxLength={length}
        onChangeText={(nextValue) => onChange(nextValue.replace(/\D/g, ""))}
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
      />

      <View style={styles.row}>
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] ?? "";
          const isActive = index === value.length && value.length < length;

          return (
            <View
              key={index}
              style={[styles.cell, Neu.inset(colors.bg.surface, 0.6), isActive && styles.activeCell]}
            >
              <AppText style={styles.cellText}>{digit}</AppText>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      alignItems: "center",
    },
    hiddenInput: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: authSpacing.sm,
    },
    cell: {
      flex: 1,
      aspectRatio: 1,
      maxWidth: 64,
      borderRadius: authRadius.input,
      justifyContent: "center",
      alignItems: "center",
    },
    activeCell: {
      backgroundColor: c.brand.primarySurface,
    },
    cellText: {
      color: c.text.primary,
      fontSize: 24,
      fontWeight: "600",
    },
  });
