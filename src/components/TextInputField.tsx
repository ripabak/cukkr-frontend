import React from 'react';
import { View, Text, TextInput, ViewStyle, KeyboardTypeOptions } from 'react-native';

interface Props {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: import('react-native').TextStyle;
  className?: string;
}

export function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  style,
  inputStyle,
  className,
}: Props) {
  return (
    <View style={style} className={className}>
      {label ? <Text className="text-[13px] text-gray mb-[6px]">{label}</Text> : null}
      <View className="bg-card rounded-full px-lg py-[14px] border border-border">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B0ADA0"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          className="text-body text-dark"
          style={[{ padding: 0 }, inputStyle]}
        />
      </View>
    </View>
  );
}
