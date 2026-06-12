import { Colors } from "@/src/theme/colors";
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";

interface Props {
  label?: string;
  required?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
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
  style,
  inputStyle,
}: Props) {
  return (
    <View style={style}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.asterisk}> *</Text> : null}
        </Text>
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          style={[styles.input, inputStyle]}
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
  asterisk: {
    color: Colors.status.danger,
  },
  inputContainer: {
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  input: {
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
    flex: 1,
  },
});
