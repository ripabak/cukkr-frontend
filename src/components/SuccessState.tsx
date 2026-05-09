import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  className?: string;
}

export function SuccessState({ title, subtitle, style, className }: Props) {
  return (
    <View
      className={`flex-1 justify-center items-center${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="text-2xl font-bold text-dark">{title}</Text>
      {subtitle ? <Text className="text-body text-gray mt-md text-center">{subtitle}</Text> : null}
    </View>
  );
}
