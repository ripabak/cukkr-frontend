import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

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
  className?: string;
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

export function StatusBadge({ label, variant = 'default', style, className }: Props) {
  const color = STATUS_COLORS[variant];

  return (
    <View
      className={`border rounded-full px-[10px] py-[4px] self-start${className ? ` ${className}` : ''}`}
      style={[{ borderColor: color }, style]}
    >
      <Text className="text-xs font-medium" style={{ color }}>{label}</Text>
    </View>
  );
}
