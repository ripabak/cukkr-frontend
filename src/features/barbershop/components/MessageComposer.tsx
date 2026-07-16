import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppTextInput } from "@/src/components/AppTextInput";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function MessageComposer({
  value,
  onChangeText,
  placeholder = "Messages to selected customers",
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <AppTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0ADA0"
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: 16,
    minHeight: 120,
  },
  input: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
    flex: 1,
    minHeight: 88,
  },
});
