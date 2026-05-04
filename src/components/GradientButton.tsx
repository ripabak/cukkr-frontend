import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  icon?: string;
  style?: ViewStyle;
}

export function GradientButton({ label, onPress, icon, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.button, style]}>
      <Text style={styles.label}>{label}</Text>
      {icon === 'login' ? (
        <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3A20',
    borderRadius: 999,
    height: 56,
    width: '100%',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
