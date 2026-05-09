import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlertModal({ visible, title, description, actionLabel, onAction }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-card rounded-[24px] p-[28px] w-[85%]">
          <Text className="text-[20px] font-bold text-center text-dark">{title}</Text>
          {description ? <Text className="text-body text-gray text-center mt-sm">{description}</Text> : null}
          {actionLabel ? (
            <TouchableOpacity onPress={onAction} activeOpacity={0.8} className="mt-xxl h-[52px] rounded-full bg-dark items-center justify-center w-full">
              <Text className="text-white text-[16px] font-semibold">{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}


