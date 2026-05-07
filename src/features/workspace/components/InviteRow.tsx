import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  email: string;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function InviteRow({ email, onRemove, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dot} />
      <Text style={styles.email}>{email}</Text>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.removeButton}>
        <Ionicons name="close" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E0DDD0',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A1A1A',
  },
  email: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 10,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
