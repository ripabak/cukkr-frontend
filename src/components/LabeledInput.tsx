import { Colors } from "@/src/theme/colors";
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
  return (
    <View style={[styles.row, style]}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.inputContainer}>
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          keyboardType={keyboardType}
          editable={editable}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.secondary,
    minWidth: 80,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
    flex: 1,
  },
});
