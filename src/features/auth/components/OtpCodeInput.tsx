import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";
import { Neu } from "@/src/theme/styles";

import { authTheme } from "../auth-theme";

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
              style={[styles.cell, Neu.inset(authTheme.colors.inputBackground, 0.6), isActive && styles.activeCell]}
            >
              <AppText style={styles.cellText}>{digit}</AppText>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    gap: authTheme.spacing.sm,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 64,
    borderRadius: authTheme.radius.input,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCell: {
    backgroundColor: authTheme.colors.accentSurface ?? "rgba(255, 200, 30, 0.12)",
  },
  cellText: {
    color: authTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "600",
  },
});
