import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useMemberRole } from "@/src/hooks";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { haptics } from "@/src/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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

const BRAND_RGB = "245, 185, 35";

/**
 * Sticky full-width bottom tab bar.
 * Each tab is a square button. The active one gets:
 *  - a bright brand-colored top border only, and
 *  - a spotlight that fades downward from that border inside the box.
 * The icon highlights in brand color; the label stays neutral.
 */
export function BottomTabBar({ activeTab, onTabPress, style }: Props) {
  const { t } = useI18nContext();
  const insets = useSafeAreaInsets();
  const { role } = useMemberRole();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

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

  const visibleTabs = role === "member"
    ? TABS.filter((tb) => tb.key !== "stats")
    : TABS;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom || 0 },
        style,
      ]}
    >
      {visibleTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => {
              haptics.selection();
              onTabPress?.(tab.key);
            }}
            activeOpacity={0.7}
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            style={styles.tab}
          >
            {isActive ? (
              <>
                <LinearGradient
                  colors={[
                    `rgba(${BRAND_RGB}, 0.22)`,
                    `rgba(${BRAND_RGB}, 0.07)`,
                    "rgba(255,255,255,0)",
                  ]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <View style={styles.activeBorder} />
              </>
            ) : null}

            <View style={styles.tabContent}>
              <Ionicons
                name={tab.icon}
                size={18}
                color={
                  isActive ? colors.brand.primary : colors.icon.muted
                }
              />
              <AppText
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={1}
              >
                {tab.label}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: c.bg.elevated,
    },
  tab: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    height: 68,
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingTop: 3, // balance: same optical space above icon as below label
  },
  activeBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: c.brand.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    zIndex: 1,
  },
  label: {
    fontSize: 9.5,
    fontWeight: "400",
    color: c.icon.muted,
  },
  labelActive: {
    // Neutral on purpose — the icon carries the brand accent.
    color: c.text.secondary,
    fontWeight: "400",
  },
});
