import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function OperationRow({ label, onPress, isLast, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, !isLast && styles.borderBottom, style]}
    >
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#666666" />
    </TouchableOpacity>
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
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },
});
