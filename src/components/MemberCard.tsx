import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '@/src/components/StatusBadge';

type StatusVariant = 'active' | 'pending' | 'default';

interface Props {
  name: string;
  status: string;
  statusVariant?: StatusVariant;
  onRemove?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function MemberCard({ name, status, statusVariant = 'active', onRemove, style, className }: Props) {
  return (
    <View className={`bg-[#D9E8A0] rounded-xl flex-row items-center px-lg py-[14px] gap-md ${className ?? ''}`} style={style}>
      <View className="w-14 h-14 rounded-full bg-[#B0ADA0]" />
      <Text className="flex-1 text-[15px] font-bold text-dark" numberOfLines={1}>{name}</Text>
      <StatusBadge label={status} variant={statusVariant} />
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7} className="w-7 h-7 rounded-full bg-dark items-center justify-center ml-[4px]">
          <Ionicons name="close" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
