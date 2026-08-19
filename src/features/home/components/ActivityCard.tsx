import { getStatusColor, getStatusSurface, Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const accentColor =
    item.type === "in_progress"
      ? getStatusColor("in_progress")
      : getStatusColor("waiting");
  const surface =
    item.type === "in_progress"
      ? getStatusSurface("in_progress")
      : getStatusSurface("waiting");
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[styles.container, Neu.soft(colors.bg.surface), style]}
    >
      <View style={[styles.circle, { backgroundColor: surface }]}>
        <Ionicons name="people" size={22} color={accentColor} />
      </View>
      <AppText style={[styles.time, { color: accentColor }]}>{item.time}</AppText>
      {item.name ? (
        <View style={styles.rightStack}>
          <AppText style={[styles.name, { color: accentColor }]}>{item.name}</AppText>
          <AppText style={[styles.duration, { color: colors.text.secondary }]}>
            {item.duration}
          </AppText>
        </View>
      ) : (
        <AppText style={[styles.duration, { color: colors.text.secondary }]}>
          {item.duration}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  container: {
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
    fontWeight: "500",
    flex: 1,
  },
  rightStack: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
  },
  duration: {
    fontSize: 12,
  },
  });
