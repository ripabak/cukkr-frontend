import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function SelectionRow({ label, onPress, isLast, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, !isLast && styles.borderBottom, style]}
    >
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    width: '100%',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#C6FF4D',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
