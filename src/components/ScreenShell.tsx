import AppTheme from "@/src/app-theme";
import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  /** Sticky element rendered ABOVE the ScrollView (e.g. ScreenHeader, custom topBar) */
  headerSlot?: React.ReactNode;
  /** Sticky element rendered BELOW the ScrollView (e.g. BottomTabBar, StickyCta) */
  footerSlot?: React.ReactNode;
  /** Absolutely-positioned overlays (SortMenu, StatusFilterMenu, OverflowMenu — NOT React Native Modal) */
  overlaySlot?: React.ReactNode;
  /** SafeAreaView background color — default: AppTheme.colors.bg ('#EEEEE0') */
  backgroundColor?: string;
  /** Additional style for scrollContent */
  contentStyle?: ViewStyle;
  /** Override SafeAreaView root style — always last */
  style?: ViewStyle;
  /** Safe area edges to apply — default: all */
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function ScreenShell({
  children,
  headerSlot,
  footerSlot,
  overlaySlot,
  backgroundColor = AppTheme.colors.bg,
  contentStyle,
  style,
  edges,
}: Props) {
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }, style]}
      edges={edges}
    >
      {headerSlot}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footerSlot}
      {overlaySlot}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: AppTheme.spacing.lg, // default paddingTop to match headerSlot spacing for all screens using ScreenShell, can be overridden by passing a custom style prop
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.spacing.xl,
    paddingBottom: 40,
  },
});
