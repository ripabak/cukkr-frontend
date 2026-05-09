import React from "react";
import { SafeAreaView, ViewStyle } from "react-native";

interface OnboardingContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }, style]}
    >
      {children}
    </SafeAreaView>
  );
};

export default OnboardingContainer;
