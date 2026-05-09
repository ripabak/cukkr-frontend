import React from 'react';
import { View, TextInput, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  className?: string;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search', style, className }: Props) {
  return (
    <View
      className={`flex-row items-center bg-card rounded-full px-lg py-md border border-border${className ? ` ${className}` : ''}`}
      style={style}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0ADA0"
        className="text-body text-dark"
        style={{ flex: 1, padding: 0 }}
      />
      <Ionicons name="search" size={18} color="#B0ADA0" />
    </View>
  );
}
