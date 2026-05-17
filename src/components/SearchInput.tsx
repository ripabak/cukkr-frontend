import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search', style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={18} color={Colors.icon.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bg.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    padding: 0,
  },
});
