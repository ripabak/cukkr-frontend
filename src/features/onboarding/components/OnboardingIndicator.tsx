import React from "react";
import { View } from "react-native";

interface OnboardingIndicatorProps {
  current: number;
  total: number;
  color?: string;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  current,
  total,
  color = '#1A1A1A',
}) => {
  return (
    <View className="flex-row justify-center items-center gap-[8px] mt-[20px]">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-[6px] rounded-full ${
            index === current ? 'w-[22px] opacity-100' : 'w-[6px] opacity-30'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </View>
  );
};

export default OnboardingIndicator;
