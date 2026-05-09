import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { ImageUploadBox } from '@/src/components/ImageUploadBox';
import { TextInputField } from '@/src/components/TextInputField';
import { MultilineInputField } from '@/src/components/MultilineInputField';
import { PrefixedInputField } from '@/src/components/PrefixedInputField';
import { ToggleRow } from '@/src/components/ToggleRow';

interface Props {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  price: string;
  onPriceChange: (v: string) => void;
  duration: string;
  onDurationChange: (v: string) => void;
  isActive: boolean;
  onActiveChange: (v: boolean) => void;
  discount?: string;
  onDiscountChange?: (v: string) => void;
  imageUri?: string;
  onImagePress?: () => void;
  showDiscount?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function ServiceForm({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  price,
  onPriceChange,
  duration,
  onDurationChange,
  isActive,
  onActiveChange,
  discount,
  onDiscountChange,
  imageUri,
  onImagePress,
  showDiscount = false,
  style,
  className,
}: Props) {
  return (
    <View className={className} style={style}>
      <ImageUploadBox
        imageUri={imageUri}
        onPress={onImagePress}
        style={{ height: 100, marginBottom: 20 }}
      />

      <TextInputField
        label="Name"
        placeholder="Service Name"
        value={name}
        onChangeText={onNameChange}
        style={{ marginBottom: 16 }}
      />

      <MultilineInputField
        label="Description (Optional)"
        placeholder="Service Description"
        value={description}
        onChangeText={onDescriptionChange}
        style={{ marginBottom: 16 }}
      />

      <Text className="text-caption text-gray mb-[6px] mt-[4px]">Price</Text>
      <PrefixedInputField
        prefix="Rp"
        placeholder="0"
        value={price}
        onChangeText={onPriceChange}
        style={{ marginBottom: 16 }}
      />

      <Text className="text-caption text-gray mb-[6px] mt-[4px]">Duration</Text>
      <PrefixedInputField
        prefix="In Minutes"
        placeholder="0"
        value={duration}
        onChangeText={onDurationChange}
        style={{ marginBottom: 16 }}
      />

      <View className="bg-[#D9E8A0] rounded-xl mb-lg">
        <ToggleRow
          label="Active"
          value={isActive}
          onValueChange={onActiveChange}
          isLast
        />
      </View>

      {showDiscount && onDiscountChange ? (
        <>
          <Text className="text-caption text-gray mb-[6px] mt-[4px]">Discount</Text>
          <PrefixedInputField
            prefix="%"
            placeholder="0"
            value={discount ?? ''}
            onChangeText={onDiscountChange}
            style={{ marginBottom: 16 }}
          />
        </>
      ) : null}
    </View>
  );
}
