import React from "react";
import {
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface OnboardingButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  style,
  textStyle,
}) => {
  const isSecondary = variant === "secondary";

  return (
    <TouchableOpacity
      className={`py-[16px] px-[20px] rounded-[8px] w-full items-center mt-[16px] ${
        isSecondary ? 'bg-accent' : 'bg-dark'
      }`}
      onPress={onPress}
      activeOpacity={0.8}
      style={style}
    >
      <Text
        className={`text-[16px] font-semibold ${isSecondary ? 'text-dark' : 'text-white'}`}
        style={textStyle}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default OnboardingButton;
