import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface Props {
  lines: string[];
  style?: ViewStyle;
  className?: string;
  errorLine?: string;
}

export function HelperCopy({ lines, style, className, errorLine }: Props) {
  return (
    <View style={style} className={className}>
      {lines.map((line, index) => (
        <Text key={index} className="text-[13px] text-gray leading-5">
          {line}
        </Text>
      ))}
      {errorLine ? <Text className="text-[13px] text-danger leading-5">{errorLine}</Text> : null}
    </View>
  );
}
