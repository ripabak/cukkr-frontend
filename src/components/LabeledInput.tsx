import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { View, StyleSheet, ViewStyle, KeyboardTypeOptions } from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";

interface Props {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  style?: ViewStyle;
}

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.row, style]}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={[styles.inputContainer, Neu.inset(colors.bg.surface)]}>
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          keyboardType={keyboardType}
          editable={editable}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: c.text.secondary,
      minWidth: 80,
    },
    inputContainer: {
      flex: 1,
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    input: {
      fontSize: 16,
      color: c.text.primary,
      padding: 0,
      flex: 1,
    },
  });
