import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

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
      <Ionicons name="calendar-outline" size={16} color={Colors.text.primary} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-down" size={14} color={Colors.text.primary} style={styles.chevron} />
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
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
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
