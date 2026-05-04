import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export function StickyCta({ label, onPress, color = '#1A1A1A', textColor = '#FFFFFF', style }: Props) {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
