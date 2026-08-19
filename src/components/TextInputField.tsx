import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";

interface Props {
  label?: string;
  required?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  editable?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  style?: ViewStyle;
  inputStyle?: import("react-native").TextStyle;
}

export function TextInputField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  editable,
  autoCapitalize,
  autoCorrect,
  style,
  inputStyle,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={style}>
      {label ? (
        <AppText style={styles.label}>
          {label}
          {required ? <AppText style={styles.asterisk}> *</AppText> : null}
        </AppText>
      ) : null}
      <View style={[styles.inputContainer, Neu.inset(colors.bg.surface, 0.6)]}>
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          style={[styles.input, inputStyle]}
        />
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    label: {
      fontSize: 13,
      fontWeight: "500",
      color: c.text.secondary,
      marginBottom: 6,
    },
    asterisk: {
      color: c.status.danger,
    },
    inputContainer: {
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
