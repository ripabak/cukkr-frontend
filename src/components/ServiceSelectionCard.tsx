import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ServiceItem {
  name: string;
  price: number;
  isDefault?: boolean;
}

interface Props {
  services: ServiceItem[];
  onSelectPress?: () => void;
  style?: ViewStyle;
}

function formatPrice(amount: number): string {
  return `Rp. ${amount.toLocaleString('id-ID')}`;
}

export function ServiceSelectionCard({ services, onSelectPress, style }: Props) {
  return (
    <View className="border border-border rounded-xl p-[14px] gap-[10px]" style={style}>
      <Text className="text-[12px] text-[#888888] mb-[2px]">Service</Text>
      {services.length === 0 ? (
        <TouchableOpacity onPress={onSelectPress} activeOpacity={0.7} className="flex-row items-center gap-sm py-[6px]">
          <Ionicons name="add-circle-outline" size={18} color="#B0ADA0" />
          <Text className="text-body text-light-gray">Select a service</Text>
        </TouchableOpacity>
      ) : (
        <>
          {services.map((svc, idx) => (
            <View key={idx} className="flex-row items-center bg-[#CFE57C] rounded-md p-[10px] gap-md">
              <View className="w-12 h-12 rounded-md bg-light-gray" />
              <View className="flex-1 gap-[2px]">
                <Text className="text-[15px] font-bold text-dark">{svc.name}</Text>
                <Text className="text-body font-semibold text-dark">{formatPrice(svc.price)}</Text>
              </View>
              {svc.isDefault ? (
                <View className="border border-dark rounded-full px-[10px] py-[4px]">
                  <Text className="text-[12px] font-semibold text-dark">Default</Text>
                </View>
              ) : null}
            </View>
          ))}
          <TouchableOpacity onPress={onSelectPress} activeOpacity={0.7} className="self-end">
            <Text className="text-[13px] text-gray underline">Change service</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


