import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function SelectionRow({ label, onPress, isLast, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center py-[18px] px-sm w-full${!isLast ? ' border-b border-accent' : ''} ${className ?? ''}`}
      style={style}
    >
      <Text className="flex-1 text-[15px] font-semibold text-dark">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
    </TouchableOpacity>
  );
}
