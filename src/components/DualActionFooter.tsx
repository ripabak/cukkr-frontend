import React from 'react';
import { View, TouchableOpacity, Text, ViewStyle } from 'react-native';

interface Props {
  declineLabel?: string;
  acceptLabel?: string;
  onDecline?: () => void;
  onAccept?: () => void;
  style?: ViewStyle;
}

export function DualActionFooter({
  declineLabel = 'Decline',
  acceptLabel = 'Accept',
  onDecline,
  onAccept,
  style,
}: Props) {
  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row gap-md px-xl pb-[36px] pt-lg bg-[#F5F4E8]" style={style}>
      <TouchableOpacity
        onPress={onDecline}
        activeOpacity={0.8}
        className="flex-1 h-[52px] rounded-full items-center justify-center border-[1.5px] border-[#FF4A4A]"
      >
        <Text className="text-[16px] font-semibold text-[#FF4A4A]">{declineLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAccept}
        activeOpacity={0.8}
        className="flex-1 h-[52px] rounded-full items-center justify-center border-[1.5px] border-[#55C46B]"
      >
        <Text className="text-[16px] font-semibold text-[#55C46B]">{acceptLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}


