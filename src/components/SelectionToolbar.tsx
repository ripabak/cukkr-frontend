import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Props {
  selectionMode: boolean;
  onToggleSelect: () => void;
  onFilterPress?: () => void;
}

export function SelectionToolbar({ selectionMode, onToggleSelect, onFilterPress }: Props) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-xl pt-sm pb-[4px]">
      {selectionMode ? (
        <View className="w-9" />
      ) : (
        <TouchableOpacity className="w-9 h-9 rounded-full bg-card items-center justify-center" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      )}
      <View className="flex-row items-center gap-md">
        <TouchableOpacity className="w-9 h-9 rounded-full bg-card items-center justify-center" onPress={onFilterPress}>
          <Ionicons name="filter" size={18} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleSelect}>
          <Text className="text-[15px] font-semibold text-dark bg-card px-[14px] py-[7px] rounded-full">{selectionMode ? 'Cancel' : 'Select'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


