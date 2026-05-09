import React from 'react';
import { View, Text, TextInput, ViewStyle } from 'react-native';

interface Props {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  numberOfLines?: number;
  style?: ViewStyle;
  className?: string;
}

export function MultilineInputField({
  label,
  value,
  onChangeText,
  placeholder,
  numberOfLines,
  style,
  className,
}: Props) {
  return (
    <View style={style} className={className}>
      {label ? <Text className="text-[13px] text-gray mb-[6px]">{label}</Text> : null}
      <View className="bg-card rounded-lg px-lg py-[14px] border border-border min-h-[100px]">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B0ADA0"
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          className="text-body text-dark"
          style={{ padding: 0, textAlignVertical: 'top' }}
        />
      </View>
    </View>
  );
}
