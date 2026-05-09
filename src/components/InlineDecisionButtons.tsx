import React from 'react';
import { View, TouchableOpacity, Text, ViewStyle } from 'react-native';

interface Props {
  declineLabel?: string;
  acceptLabel?: string;
  onDecline?: () => void;
  onAccept?: () => void;
  style?: ViewStyle;
}

export function InlineDecisionButtons({
  declineLabel = 'Decline',
  acceptLabel = 'Accept',
  onDecline,
  onAccept,
  style,
}: Props) {
  return (
    <View className="flex-row gap-[10px] mt-[10px]" style={style}>
      <TouchableOpacity
        onPress={onDecline}
        activeOpacity={0.8}
        className="px-xl py-[10px] rounded-full items-center justify-center border-[1.5px] border-[#FF4A4A]"
      >
        <Text className="text-body font-semibold text-[#FF4A4A]">{declineLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAccept}
        activeOpacity={0.8}
        className="px-xl py-[10px] rounded-full items-center justify-center border-[1.5px] border-[#55C46B]"
      >
        <Text className="text-body font-semibold text-[#55C46B]">{acceptLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}


