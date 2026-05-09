import React from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
  totalSteps: number;
  currentStep: number;
  style?: ViewStyle;
  className?: string;
}

export function WizardProgress({ totalSteps, currentStep, style, className }: Props) {
  return (
    <View
      className={`flex-row gap-sm${className ? ` ${className}` : ''}`}
      style={style}
    >
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          className={`flex-1 h-[6px] rounded-full ${i <= currentStep - 1 ? 'bg-dark' : 'bg-[#D0D0C8]'}`}
        />
      ))}
    </View>
  );
}
