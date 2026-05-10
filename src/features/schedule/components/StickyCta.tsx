import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export function StickyCta({ label, onPress, color = Colors.brand.primary, textColor = Colors.text.primary, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.cta, { backgroundColor: color }, style]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cta: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
