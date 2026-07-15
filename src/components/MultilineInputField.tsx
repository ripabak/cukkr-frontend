import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";

interface Props {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  numberOfLines?: number;
  editable?: boolean;
  style?: ViewStyle;
}

export function MultilineInputField({
  label,
  value,
  onChangeText,
  placeholder,
  numberOfLines,
  editable,
  style,
}: Props) {
  return (
    <View style={style}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <View style={styles.inputContainer}>
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          editable={editable}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border.default,
    minHeight: 100,
  },
  input: {
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
    textAlignVertical: "top",
    flex: 1,
    minHeight: 72,
  },
});
