import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  name: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function WorkspacePill({ name, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Text style={styles.name}>{name}</Text>
      <Ionicons name="chevron-down" size={16} color="#666666" style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E0DDD0',
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  icon: {
    marginLeft: 4,
  },
});
