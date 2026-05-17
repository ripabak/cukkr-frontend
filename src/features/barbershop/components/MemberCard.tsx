import { Colors } from '@/src/theme/colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '@/src/components/StatusBadge';

type StatusVariant = 'active' | 'pending' | 'default';

interface Props {
  name: string;
  nameSmall?: boolean;
  role?: string;
  isYou?: boolean;
  status: string;
  statusVariant?: StatusVariant;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function MemberCard({ name, nameSmall, role, isYou, status, statusVariant = 'active', onRemove, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, nameSmall && styles.nameSmall]} numberOfLines={1}>
            {name}
          </Text>
          {isYou ? <Text style={styles.you}>(You)</Text> : null}
        </View>
        {role ? <Text style={styles.role}>{role}</Text> : null}
      </View>
      <View style={styles.actions}>
        <StatusBadge label={status} variant={statusVariant} />
        {onRemove ? (
          <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.removeBtn}>
            <Ionicons name="close" size={14} color={Colors.text.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.brand.primarySurface,
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
    backgroundColor: Colors.bg.surface,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
    flexShrink: 1,
  },
  nameSmall: {
    fontSize: 13,
    fontWeight: '500',
  },
  you: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '400',
  },
  role: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
