import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  style?: ViewStyle;
  className?: string;
}

export function ToggleSwitch({ value, onValueChange, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      className={`w-11 h-6 rounded-full justify-center px-[2px]${className ? ` ${className}` : ''}`}
      style={[{ backgroundColor: value ? '#C6FF4D' : '#D0CEC0' }, style]}
    >
      <View
        className="w-5 h-5 rounded-full bg-white"
        style={{ alignSelf: value ? 'flex-end' : 'flex-start' }}
      />
    </TouchableOpacity>
  );
}
