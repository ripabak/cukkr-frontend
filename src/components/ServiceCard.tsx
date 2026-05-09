import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { StatusBadge } from '@/src/components/StatusBadge';
import { ToggleSwitch } from '@/src/components/ToggleSwitch';

interface Props {
  name: string;
  price: number;
  discountPercent?: number;
  imageUri?: string;
  isDefault?: boolean;
  isActive?: boolean;
  onToggleActive?: (v: boolean) => void;
  style?: ViewStyle;
  className?: string;
}

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function ServiceCard({
  name,
  price,
  discountPercent,
  imageUri,
  isDefault,
  isActive = true,
  onToggleActive,
  style,
  className,
}: Props) {
  const finalPrice = discountPercent
    ? Math.round(price * (1 - discountPercent / 100))
    : price;

  return (
    <View className={`bg-[#D9E8A0] rounded-xl flex-row items-center px-lg py-[14px] gap-md ${className ?? ''}`} style={style}>
      <View className="w-14 h-14 rounded-md overflow-hidden">
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full bg-[#B0ADA0]" />
        )}
      </View>
      <View className="flex-1 gap-[2px]">
        <Text className="text-[15px] font-bold text-dark" numberOfLines={1}>{name}</Text>
        {discountPercent ? (
          <View className="flex-row items-center gap-[6px]">
            <View className="bg-dark rounded-[4px] px-[5px] py-[2px]">
              <Text className="text-accent text-[10px] font-bold">{discountPercent}% OFF</Text>
            </View>
            <Text className="text-[12px] text-gray line-through">{formatPrice(price)}</Text>
          </View>
        ) : null}
        <Text className="text-body font-semibold text-dark">{formatPrice(finalPrice)}</Text>
      </View>
      <View className="items-end gap-sm">
        {isDefault ? (
          <StatusBadge label="Default" variant="default" style={{ marginBottom: 4 }} />
        ) : null}
        {onToggleActive !== undefined ? (
          <ToggleSwitch value={isActive} onValueChange={onToggleActive} />
        ) : null}
      </View>
    </View>
  );
}
