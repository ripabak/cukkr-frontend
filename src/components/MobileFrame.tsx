import React from "react";
import { Platform, View } from "react-native";

const MOBILE_WIDTH = 390;

interface Props {
  children: React.ReactNode;
}

export function MobileFrame({ children }: Props) {
  if (Platform.OS !== "web") {
    return <View className="flex-1">{children}</View>;
  }

  return (
    <View className="flex-1 bg-dark items-center">
      <View className="flex-1 overflow-hidden" style={{ width: MOBILE_WIDTH }}>{children}</View>
    </View>
  );
}
