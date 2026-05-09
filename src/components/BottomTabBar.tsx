import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

type Tab = "home" | "stats" | "schedule" | "profile";

interface Props {
  activeTab: Tab;
  onTabPress?: (tab: Tab) => void;
  style?: ViewStyle;
}

const TABS: {
  key: Tab;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "home", icon: "home" },
  { key: "stats", icon: "bar-chart" },
  { key: "schedule", icon: "calendar" },
  { key: "profile", icon: "person" },
];

export function BottomTabBar({ activeTab, onTabPress, style }: Props) {
  return (
    <View className="flex-row bg-card rounded-full px-sm py-sm" style={[{ shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 }, style]}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            activeOpacity={0.7}
            className="flex-1 items-center py-sm"
          >
            <View className={`w-11 h-11 rounded-full items-center justify-center${isActive ? ' bg-accent' : ''}`}>
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? "#1A1A1A" : "#666666"}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


