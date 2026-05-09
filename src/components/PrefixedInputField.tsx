import React from 'react';
import { View, Text, TextInput, ViewStyle } from 'react-native';

interface Props {
  prefix: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  className?: string;
}

export function PrefixedInputField({ prefix, value, onChangeText, placeholder, style, className }: Props) {
  return (
    <View
      className={`flex-row items-center bg-card rounded-full border border-border px-lg py-[14px]${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="text-body text-dark">{prefix}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0ADA0"
        className="text-body text-dark"
        style={{ flex: 1, padding: 0 }}
      />
    </View>
  );
}
