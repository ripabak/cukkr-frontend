import React from "react";
import { View, ViewStyle } from "react-native";

interface OnboardingCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  children,
  style,
}) => {
  return (
    <View
      className="bg-white rounded-xl p-xl w-[90%] max-w-[380px] min-h-[500px] justify-between items-center"
      style={style}
    >
      {children}
    </View>
  );
};

export default OnboardingCard;
