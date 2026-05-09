import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  count: number;
}

export function SelectionFooter({ count }: Props) {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-xl py-[18px] pb-[32px]">
      <Text className="text-[15px] font-semibold text-dark">Select Customers ({count})</Text>
    </View>
  );
}


