import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function LogoutRow({ onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-card rounded-lg flex-row items-center px-lg py-[18px]${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="flex-1 text-[15px] font-semibold text-dark">Logout</Text>
      <Ionicons name="exit-outline" size={20} color="#1A1A1A" />
    </TouchableOpacity>
  );
}
