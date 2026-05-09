import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function InfoRow({ label, value, onPress, showChevron, isLast, style, className }: Props) {
  const content = (
    <View
      className={`flex-row items-center px-lg py-[14px]${!isLast ? ' border-b border-border' : ''} ${className ?? ''}`}
      style={style}
    >
      <Text className="font-bold text-body text-dark">{label}</Text>
      {value ? <Text className="text-body text-gray flex-1 text-right">{value}</Text> : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color="#666666" />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
