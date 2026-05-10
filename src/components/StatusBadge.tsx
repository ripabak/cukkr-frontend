import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type StatusVariant =
  | 'active'
  | 'pending'
  | 'waiting'
  | 'in_progress'
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
  active: Colors.status.success,
  pending: Colors.status.warning,
  waiting: Colors.status.waiting,
  in_progress: Colors.status.inProgress,
  completed: Colors.status.success,
  canceled: Colors.status.danger,
  requested: Colors.brand.primaryDark,
  declined: Colors.status.danger,
  default: Colors.text.secondary,
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
