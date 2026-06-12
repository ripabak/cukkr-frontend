import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

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
  onPress?: () => void;
}

export function ActivityCard({ item, style, onPress }: Props) {
  const accentColor =
    item.type === "in_progress"
      ? Colors.status.inProgress
      : Colors.status.waiting;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={[styles.container, style]}
    >
      <View style={styles.circle}>
        <Ionicons name="people" size={22} color={accentColor} />
      </View>
      <Text style={[styles.time, { color: accentColor }]}>{item.time}</Text>
      {item.name ? (
        <View style={styles.rightStack}>
          <Text style={[styles.name, { color: accentColor }]}>{item.name}</Text>
          <Text style={[styles.duration, { color: Colors.text.secondary }]}>
            {item.duration}
          </Text>
        </View>
      ) : (
        <Text style={[styles.duration, { color: Colors.text.secondary }]}>
          {item.duration}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 50,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg.default,
  },
  time: {
    fontSize: 13,
    fontWeight: "600",
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
