import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, Text, TextInput, StyleSheet, ViewStyle } from "react-native";

interface Props {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  numberOfLines?: number;
  style?: ViewStyle;
}

export function MultilineInputField({
  label,
  value,
  onChangeText,
  placeholder,
  numberOfLines,
  style,
}: Props) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
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
  },
});
