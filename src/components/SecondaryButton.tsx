import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function SecondaryButton({ label, onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-full h-[52px] rounded-full bg-card border-[1.5px] border-dark items-center justify-center${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="text-dark text-base font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
