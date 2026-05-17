import { Colors } from '@/src/theme/colors';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  isActive?: boolean;
  style?: ViewStyle;
}

export function SelectionRow({ label, onPress, isLast, isActive, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isActive ? 1 : 0.7}
      style={[styles.container, !isLast && styles.borderBottom, style]}
    >
      <Text style={[styles.label, isActive && styles.labelDisabled]}>{label}</Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isActive ? Colors.icon.muted : Colors.text.primary}
      />
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
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  labelDisabled: {
    color: Colors.icon.muted,
    fontWeight: '400',
  },
});
