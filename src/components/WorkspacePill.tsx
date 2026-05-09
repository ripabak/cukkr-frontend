import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: string;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function WorkspacePill({ name, onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-[14px] py-[10px] rounded-full border border-border bg-card ${className ?? ''}`}
      style={style}
    >
      <Text className="text-[15px] font-semibold text-dark">{name}</Text>
      <Ionicons name="chevron-down" size={16} color="#666666" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}
