import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function DangerButton({ label, onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-full rounded-md bg-danger-bg py-[14px]${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="text-[15px] font-semibold text-danger text-center">{label}</Text>
    </TouchableOpacity>
  );
}
