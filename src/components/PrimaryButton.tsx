import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function PrimaryButton({ label, onPress, disabled, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`w-full h-[52px] rounded-full bg-dark items-center justify-center${disabled ? ' opacity-50' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="text-white text-base font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
