import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
}

export function FloatingActionButton({ onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.btn, style]}
    >
      <Ionicons name="send" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
