import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeKey: string;
  onTabPress: (key: string) => void;
  style?: ViewStyle;
}

export function SegmentedTabs({ tabs, activeKey, onTabPress, style }: Props) {
  return (
    <View className="flex-row bg-[#C6ED3C] rounded-full p-[4px]" style={style}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.8}
            className={`flex-1 py-[9px] rounded-full items-center justify-center${isActive ? ' bg-card' : ''}`}
          >
            <Text className={`text-[13px]${isActive ? ' font-bold text-dark' : ' font-medium text-[#555533]'}`}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


