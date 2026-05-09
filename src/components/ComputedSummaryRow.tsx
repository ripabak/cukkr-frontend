import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  value: string;
  style?: ViewStyle;
  className?: string;
}

export function ComputedSummaryRow({ label, value, style, className }: Props) {
  return (
    <View className={className} style={style}>
      <View className="h-px bg-border mx-lg" />
      <View className="flex-row items-center px-lg py-[14px]">
        <Text className="flex-1 text-body font-semibold text-dark">{label}</Text>
        <Text className="text-body font-bold text-dark">{value}</Text>
      </View>
    </View>
  );
}
