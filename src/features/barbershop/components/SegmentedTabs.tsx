import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeKey: string;
  onTabPress: (key: string) => void;
  style?: ViewStyle;
}

export function SegmentedTabs({ tabs, activeKey, onTabPress, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, Neu.inset(colors.bg.surface), style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.85}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <AppText style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </AppText>
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
      borderRadius: 50,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    tabActive: {
      backgroundColor: c.brand.primary,
      ...Neu.accent(0.7),
    },
    label: {
      fontSize: 13,
      fontWeight: "500",
      color: c.text.secondary,
    },
    labelActive: {
      fontWeight: "600",
      color: c.text.primary,
    },
  });
