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
import { Neu } from "@/src/theme/styles";

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

  const visibleTabs =
    role === "member"
      ? TABS.filter((tb) => tb.key !== "stats")
      : TABS;

  return (
    <View
      style={[
        styles.container,
        Neu.raised(Colors.bg.surface, 0.8),
        { paddingBottom: insets.bottom || 12 },
        style,
      ]}
    >
      {visibleTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? Colors.brand.primaryDark : Colors.icon.muted;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            activeOpacity={0.7}
            accessibilityLabel={tab.label}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <View
              style={[styles.iconRing, isActive && styles.iconRingActive]}
            >
              <Ionicons name={tab.icon} size={22} color={color} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingTop: 10,
    borderRadius: 28,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    transform: [{ translateY: -2 }],
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRingActive: {
    backgroundColor: Colors.brand.primarySurface,
  },
});
