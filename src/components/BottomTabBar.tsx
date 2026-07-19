import { useI18nContext } from "@/src/lib/i18n/provider";
import { useMemberRole } from "@/src/hooks";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
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

export function BottomTabBar({ activeTab, onTabPress, style }: Props) {
  const { t } = useI18nContext();
  const insets = useSafeAreaInsets();
  const { role } = useMemberRole();

  const TABS: {
    key: Tab;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
    { key: "home", label: t("tabs.home"), icon: "home" },
    { key: "schedule", label: t("tabs.schedule"), icon: "calendar" },
    { key: "stats", label: t("tabs.analytics"), icon: "bar-chart" },
    { key: "barbershop", label: t("tabs.settings"), icon: "storefront" },
  ];

  const visibleTabs = role === "member" ? TABS.filter((t) => t.key !== "stats") : TABS;
  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom || 12 }, style]}
    >
      {visibleTabs.map((tab) => {
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
            <AppText style={[styles.label, { color }]}>{tab.label}</AppText>
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
