import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  prefix: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function PrefixedInputField({ prefix, value, onChangeText, placeholder, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.prefix}>{prefix}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0ADA0"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E0DDD0',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  prefix: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    padding: 0,
  },
});
