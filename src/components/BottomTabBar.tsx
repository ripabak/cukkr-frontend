import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tab = "home" | "stats" | "schedule" | "barbershop";

interface Props {
  activeTab: Tab;
  onTabPress?: (tab: Tab) => void;
  style?: ViewStyle;
}

const TABS: {
  key: Tab;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "schedule", label: "Schedule", icon: "calendar" },
  { key: "stats", label: "Stats", icon: "bar-chart" },
  { key: "barbershop", label: "Barbershop", icon: "storefront" },
];

export function BottomTabBar({ activeTab, onTabPress, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom || 12 }, style]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? Colors.brand.primary : Colors.icon.muted;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <Ionicons name={tab.icon} size={21} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.bg.default,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: "500",
  },
});
