import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function ShortcutTile({ label, icon, onPress, style, className }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className={`flex-1 items-center py-lg ${className ?? ''}`} style={style}>
      <View className="w-12 h-12 rounded-full bg-[#F0F0E8] items-center justify-center">{icon}</View>
      <Text className="text-label font-medium text-dark mt-sm">{label}</Text>
    </TouchableOpacity>
  );
}
