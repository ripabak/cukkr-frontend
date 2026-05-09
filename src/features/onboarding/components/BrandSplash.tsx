import React from "react";
import { Text, View, ViewStyle } from "react-native";

interface BrandSplashProps {
  style?: ViewStyle;
}

export const BrandSplash: React.FC<BrandSplashProps> = ({ style }) => {
  return (
    <View className="flex-1 bg-[#F5F4E8] justify-center items-center" style={style}>
      <Text className="text-[32px] font-bold text-black tracking-[0.5px]">Cukkr</Text>
    </View>
  );
};

export default BrandSplash;
