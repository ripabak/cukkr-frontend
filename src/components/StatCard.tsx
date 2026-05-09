import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  value: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
  className?: string;
}

export function StatCard({ label, value, iconName, iconColor = '#C6ED3C', style, className }: Props) {
  return (
    <View className={`bg-card rounded-xl p-lg flex-1 gap-[6px] ${className ?? ''}`} style={style}>
      <Text className="text-[12px] text-[#888888] font-medium">{label}</Text>
      <View className="flex-row items-center gap-[6px]">
        {iconName && (
          <Ionicons name={iconName} size={20} color={iconColor} />
        )}
        <Text className="text-[22px] font-bold text-dark">{value}</Text>
      </View>
    </View>
  );
}
