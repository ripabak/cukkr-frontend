import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function DateSelectorPill({ label, onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center bg-card rounded-full px-[14px] py-[10px] shadow-sm self-start ${className ?? ''}`}
      style={style}
    >
      <Ionicons name="calendar-outline" size={16} color="#1A1A1A" style={{ marginRight: 6 }} />
      <Text className="text-body font-medium text-dark">{label}</Text>
      <Ionicons name="chevron-down" size={14} color="#1A1A1A" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
  );
}
