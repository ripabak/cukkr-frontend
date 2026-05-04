import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ToggleSwitch } from '@/src/components/ToggleSwitch';

interface Props {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function ToggleRow({ label, value, onValueChange, isLast, style }: Props) {
  return (
    <View style={[styles.container, !isLast && styles.borderBottom, style]}>
      <Text style={styles.label}>{label}</Text>
      <ToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD0',
  },
  label: {
    flex: 1,
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1A1A',
  },
});
