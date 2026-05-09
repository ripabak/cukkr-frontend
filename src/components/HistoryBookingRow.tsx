import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingStatus } from './BookingCard';

interface Props {
  customerName: string;
  barberName: string;
  dateTimeLabel: string;
  duration: string;
  status: BookingStatus;
  onPress?: () => void;
  style?: ViewStyle;
}

const STATUS_COLOR: Record<BookingStatus, string> = {
  waiting: '#F0A11A',
  'in-progress': '#0D78FF',
  completed: '#4CC76B',
  canceled: '#FF4A4A',
  requested: '#1A1A1A',
};

const STATUS_ICON_BG: Record<BookingStatus, string> = {
  waiting: '#FFF3E0',
  'in-progress': '#E3EFFF',
  completed: '#E8F8EE',
  canceled: '#FFE8E8',
  requested: '#F0F0E8',
};

const STATUS_ICON: Record<BookingStatus, React.ComponentProps<typeof Ionicons>['name']> = {
  waiting: 'people',
  'in-progress': 'people',
  completed: 'calendar-sharp',
  canceled: 'people',
  requested: 'calendar',
};

export function HistoryBookingRow({
  customerName,
  barberName,
  dateTimeLabel,
  duration,
  status,
  onPress,
  style,
}: Props) {
  const color = STATUS_COLOR[status];
  const iconBg = STATUS_ICON_BG[status];
  const icon = STATUS_ICON[status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center bg-card rounded-xl p-[14px] gap-md shadow-sm"
      style={style}
    >
      <View className="w-[42px] h-[42px] rounded-full items-center justify-center" style={{ backgroundColor: iconBg }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1 gap-[4px]">
        <Text className="text-[13px] font-medium" style={{ color }}>{dateTimeLabel}</Text>
        <View className="flex-row items-center">
          <Ionicons name="cut" size={12} color="#888888" />
          <Text className="text-[12px] text-[#888888]"> {barberName}</Text>
        </View>
      </View>
      <View className="items-end gap-[2px]">
        <Text className="text-[13px] font-semibold" style={{ color }}>{customerName}</Text>
        <Text className="text-[12px] text-[#888888]">{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}
