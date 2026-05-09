import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function FloatingActionButton({ onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`absolute bottom-7 right-xl w-[52px] h-[52px] rounded-full bg-[#111111] items-center justify-center shadow-md${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Ionicons name="send" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
