import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search', style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0ADA0"
        style={styles.input}
      />
      <Ionicons name="search" size={18} color="#B0ADA0" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0DDD0',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    padding: 0,
  },
});
