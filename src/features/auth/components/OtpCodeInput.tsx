import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
      <TextInput
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
              style={[styles.cell, isActive && styles.activeCell]}
            >
              <Text style={styles.cellText}>{digit}</Text>
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
    borderWidth: 1,
    borderColor: authTheme.colors.border,
    backgroundColor: authTheme.colors.inputBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCell: {
    borderColor: authTheme.colors.accentDark,
  },
  cellText: {
    color: authTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
});
