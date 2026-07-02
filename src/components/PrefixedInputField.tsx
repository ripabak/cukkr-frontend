import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, Text, TextInput, StyleSheet, ViewStyle } from "react-native";

interface Props {
  prefix: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
}

export function PrefixedInputField({
  prefix,
  value,
  onChangeText,
  placeholder,
  editable,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.prefix}>{prefix}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.muted}
        editable={editable}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prefix: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
  },
});
