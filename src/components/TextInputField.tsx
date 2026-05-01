import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, KeyboardTypeOptions } from 'react-native';

interface Props {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: import('react-native').TextStyle;
}

export function TextInputField({
  label,
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
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B0ADA0"
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
    color: '#666666',
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0DDD0',
  },
  input: {
    fontSize: 14,
    color: '#1A1A1A',
    padding: 0,
  },
});
