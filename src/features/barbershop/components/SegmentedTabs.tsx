import { Colors } from "@/src/theme/colors";
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
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.8}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.bg.surface,
    borderRadius: 50,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: Colors.brand.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  labelActive: {
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
