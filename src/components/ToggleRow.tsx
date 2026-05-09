import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { ToggleSwitch } from '@/src/components/ToggleSwitch';

interface Props {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function ToggleRow({ label, value, onValueChange, isLast, style, className }: Props) {
  return (
    <View
      className={`flex-row items-center px-lg py-[14px]${!isLast ? ' border-b border-border' : ''} ${className ?? ''}`}
      style={style}
    >
      <Text className="flex-1 font-bold text-body text-dark">{label}</Text>
      <ToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}
