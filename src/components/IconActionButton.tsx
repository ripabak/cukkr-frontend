import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
  className?: string;
}

export function IconActionButton({ iconName, onPress, size = 48, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`bg-dark items-center justify-center${className ? ` ${className}` : ''}`}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <Ionicons name={iconName} size={size * 0.42} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
