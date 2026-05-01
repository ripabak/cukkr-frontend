import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  placeholder: string;
  value?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SelectorInput({ placeholder, value, iconName, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      {iconName ? (
        <Ionicons name={iconName} size={18} color="#B0ADA0" style={styles.icon} />
      ) : null}
      <Text style={[styles.text, value ? styles.textFilled : styles.textPlaceholder]} numberOfLines={1}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#B0ADA0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0DDD0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {},
  text: {
    flex: 1,
    fontSize: 14,
  },
  textPlaceholder: {
    color: '#B0ADA0',
  },
  textFilled: {
    color: '#1A1A1A',
  },
});
