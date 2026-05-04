import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function DateSelectorPill({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.pill, style]}
    >
      <Ionicons name="calendar-outline" size={16} color="#1A1A1A" style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#1A1A1A" style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  chevron: {
    marginLeft: 6,
  },
});
