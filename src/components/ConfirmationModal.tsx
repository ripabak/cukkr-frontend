import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  icon?: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmationModal({
  visible,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const hasBoth = !!confirmLabel && !!cancelLabel;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-card rounded-[24px] p-[28px] w-[85%]">
          {icon ? (
            <View className="items-center mb-lg">
              <Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={32} color="#1A1A1A" />
            </View>
          ) : null}
          <Text className="text-[20px] font-bold text-center text-dark">{title}</Text>
          {description ? <Text className="text-body text-gray text-center mt-sm">{description}</Text> : null}
          <View className={`mt-xxl gap-md${hasBoth ? ' flex-row' : ''}`}>
            {cancelLabel ? (
              <TouchableOpacity
                onPress={onCancel}
                activeOpacity={0.8}
                className={`h-[52px] rounded-full items-center justify-center bg-dark${hasBoth ? ' flex-1' : ''}`}
              >
                <Text className="text-white text-[16px] font-semibold">{cancelLabel}</Text>
              </TouchableOpacity>
            ) : null}
            {confirmLabel ? (
              <TouchableOpacity
                onPress={onConfirm}
                activeOpacity={0.8}
                className={`h-[52px] rounded-full items-center justify-center border-[1.5px] border-dark${hasBoth ? ' flex-1' : ''}`}
              >
                <Text className="text-dark text-[16px] font-semibold">{confirmLabel}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}


