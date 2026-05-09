import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  className?: string;
}

export function StickyCta({ label, onPress, color = '#1A1A1A', textColor = '#FFFFFF', style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`absolute bottom-8 left-xl right-xl h-[52px] rounded-full items-center justify-center shadow-md${className ? ` ${className}` : ''}`}
      style={[{ backgroundColor: color }, style]}
    >
      <Text className="text-base font-semibold" style={{ color: textColor }}>{label}</Text>
    </TouchableOpacity>
  );
}
