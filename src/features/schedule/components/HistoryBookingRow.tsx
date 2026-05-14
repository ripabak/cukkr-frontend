import { Colors } from '@/src/theme/colors';
import { BookingStatus, BookingType } from '@/src/components/BookingCard';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  customerName: string;
  barberName: string;
  dateTimeLabel: string;
  duration: string;
  status: BookingStatus;
  bookingType?: BookingType;
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

export function HistoryBookingRow({
  customerName,
  barberName,
  dateTimeLabel,
  duration,
  status,
  bookingType,
  onPress,
  style,
}: Props) {
  const color = STATUS_COLOR[status];
  const iconBg = STATUS_ICON_BG[status];
  const iconName = bookingType === 'walk_in' ? 'walk' : bookingType === 'appointment' ? 'calendar' : 'people';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.row, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={20} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.dateTime, { color }]}>{dateTimeLabel}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    elevation: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  dateTime: {
    fontSize: 13,
    fontWeight: '500',
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
