import { Ionicons } from "@expo/vector-icons";
import { Text, View, ViewStyle } from "react-native";

export type RecentActivity = {
  id: string;
  time: string;
  duration: string;
  name?: string;
  type: "in-progress" | "waiting";
};

interface Props {
  item: RecentActivity;
  style?: ViewStyle;
}

export function ActivityCard({ item, style }: Props) {
  const accentColor = item.type === "in-progress" ? "#2196F3" : "#EBA109";
  return (
    <View
      className="bg-card rounded-full p-md flex-row items-center mt-sm"
      style={style}
    >
      <View
        className="w-10 h-10 rounded-full mr-md items-center justify-center"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <Ionicons name="people" size={24} color={accentColor} />
      </View>
      <Text className="text-[13px] flex-1" style={{ color: accentColor }}>
        {item.time}
      </Text>
      {item.name ? (
        <View className="items-end mr-sm">
          <Text className="text-[13px] font-semibold" style={{ color: accentColor }}>
            {item.name}
          </Text>
          <Text className="text-[12px]" style={{ color: accentColor }}>
            {item.duration}
          </Text>
        </View>
      ) : (
        <Text className="text-[12px]" style={{ color: accentColor }}>
          {item.duration}
        </Text>
      )}
    </View>
  );
}
