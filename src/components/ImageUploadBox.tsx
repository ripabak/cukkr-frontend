import React from 'react';
import { TouchableOpacity, View, Text, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress?: () => void;
  imageUri?: string;
  label?: string;
  style?: ViewStyle;
  className?: string;
}

export function ImageUploadBox({ onPress, imageUri, label, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`w-full h-[60px] rounded-lg border-[1.5px] border-dashed border-light-gray bg-card items-center justify-center overflow-hidden${className ? ` ${className}` : ''}`}
      style={style}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
      ) : (
        <View className="flex-row items-center">
          <Ionicons name="image-outline" size={20} color="#B0ADA0" />
          <Text className="text-body text-light-gray ml-[10px]">{label ?? 'Choose Image'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
