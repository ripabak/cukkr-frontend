import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export type BookingStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'requested';

interface Props {
  customerName: string;
  barberName: string;
  timeLabel: string;
  duration: string;
  status: BookingStatus;
  onPress?: () => void;
  style?: ViewStyle;
}

const STATUS_COLOR: Record<BookingStatus, string> = {
  waiting: '#F0A11A',
  'in_progress': '#0D78FF',
  completed: '#4CC76B',
  cancelled: '#FF4A4A',
  requested: '#1A1A1A',
};

const STATUS_ICON_BG: Record<BookingStatus, string> = {
  waiting: '#FFF3E0',
  'in_progress': '#E3EFFF',
  completed: '#E8F8EE',
  cancelled: '#FFE8E8',
  requested: '#F0F0E8',
};

export function BookingCard({
  customerName,
  barberName,
  timeLabel,
  duration,
  status,
  onPress,
  style,
}: Props) {
  const color = STATUS_COLOR[status];
  const iconBg = STATUS_ICON_BG[status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name="people" size={22} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.timeLabel}>{timeLabel}</Text>
        <View style={styles.barberRow}>
          <Ionicons name="cut" size={12} color="#888888" />
          <Text style={styles.barberName}> {barberName}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.customerName, { color }]}>{customerName}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberName: {
    fontSize: 12,
    color: '#888888',
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
    color: '#888888',
  },
});
