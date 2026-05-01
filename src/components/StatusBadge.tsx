import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type StatusVariant =
  | 'active'
  | 'pending'
  | 'waiting'
  | 'in-progress'
  | 'completed'
  | 'canceled'
  | 'requested'
  | 'declined'
  | 'default';

interface Props {
  label: string;
  variant?: StatusVariant;
  style?: ViewStyle;
}

const STATUS_COLORS: Record<StatusVariant, string> = {
  active: '#1A1A1A',
  pending: '#FF9800',
  waiting: '#F0A11A',
  'in-progress': '#0D78FF',
  completed: '#55C46B',
  canceled: '#FF4A4A',
  requested: '#B8A800',
  declined: '#FF4A4A',
  default: '#1A1A1A',
};

export function StatusBadge({ label, variant = 'default', style }: Props) {
  const color = STATUS_COLORS[variant];

  return (
    <View style={[styles.badge, { borderColor: color }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
