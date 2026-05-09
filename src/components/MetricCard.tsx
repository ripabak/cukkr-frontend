import React from "react";
import { Text, View, ViewStyle } from "react-native";

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
  className?: string;
}

export function MetricCard({ label, value, icon, accentColor, style, className }: Props) {
  return (
    <View
      className={`bg-card rounded-md p-md flex-1 ${className ?? ''}`}
      style={[
        accentColor ? { borderWidth: 1, borderColor: accentColor } : undefined,
        style,
      ]}
    >
      <Text
        className="text-[12px] text-gray"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {label}
      </Text>
      <View className="flex-row items-center mt-[2px] gap-xs">
        {icon ? <View style={{ marginRight: 2 }}>{icon}</View> : null}
        <Text
          className="text-[22px] font-bold text-dark"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
