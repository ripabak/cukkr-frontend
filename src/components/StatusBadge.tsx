import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type StatusVariant = 'active' | 'pending' | 'default';

interface Props {
  label: string;
  variant?: StatusVariant;
  style?: ViewStyle;
}

export function StatusBadge({ label, variant = 'default', style }: Props) {
  const borderColor =
    variant === 'pending' ? '#FF9800' : '#1A1A1A';
  const textColor =
    variant === 'pending' ? '#FF9800' : '#1A1A1A';

  return (
    <View style={[styles.badge, { borderColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
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
