import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '@/src/components/StatusBadge';

type StatusVariant = 'active' | 'pending' | 'default';

interface Props {
  name: string;
  status: string;
  statusVariant?: StatusVariant;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function MemberCard({ name, status, statusVariant = 'active', onRemove, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <StatusBadge label={status} variant={statusVariant} style={styles.badge} />
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.removeBtn}>
          <Ionicons name="close" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D9E8A0',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B0ADA0',
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  badge: {
    flexShrink: 0,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
