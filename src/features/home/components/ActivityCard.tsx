import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

export type RecentActivity = {
  id: string;
  time: string;
  duration: string;
  name?: string;
  type: "in_progress" | "waiting";
};

interface Props {
  item: RecentActivity;
  style?: ViewStyle;
}

export function ActivityCard({ item, style }: Props) {
  const accentColor = item.type === "in_progress" ? "#2196F3" : "#EBA109";
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.circle, { backgroundColor: "#F2F2F7" }]}>
        <Ionicons name="people" size={24} color={accentColor} />
      </View>
      <Text style={[styles.time, { color: accentColor }]}>{item.time}</Text>
      {item.name ? (
        <View style={styles.rightStack}>
          <Text style={[styles.name, { color: accentColor }]}>{item.name}</Text>
          <Text style={[styles.duration, { color: accentColor }]}>
            {item.duration}
          </Text>
        </View>
      ) : (
        <Text style={[styles.duration, { color: accentColor }]}>
          {item.duration}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 13,
    flex: 1,
  },
  rightStack: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
  },
  duration: {
    fontSize: 12,
  },
});
