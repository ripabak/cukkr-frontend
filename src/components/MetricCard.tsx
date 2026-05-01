import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

export function MetricCard({ label, value, icon, accentColor, style }: Props) {
  return (
    <View
      style={[
        styles.card,
        accentColor ? { borderLeftWidth: 2.5, borderLeftColor: accentColor } : undefined,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      {icon ?? null}
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
