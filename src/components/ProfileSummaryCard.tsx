import React from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

export function ProfileSummaryCard({ children, style, className }: Props) {
  return (
    <View className={`bg-[#D4E88F] rounded-xl overflow-hidden ${className ?? ''}`} style={style}>
      {children}
    </View>
  );
}
