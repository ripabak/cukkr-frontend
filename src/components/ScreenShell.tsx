import AppTheme from "@/src/app-theme";
import { AppHeader } from "@/src/components/AppHeader";
import { Colors } from "@/src/theme/colors";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  /** Sticky element rendered ABOVE the ScrollView (e.g. ScreenHeader, custom topBar) */
  headerSlot?: React.ReactNode;
  /** Sticky element rendered BELOW the ScrollView (e.g. BottomTabBar, StickyCta) */
  footerSlot?: React.ReactNode;
  /** Absolutely-positioned overlays (SortMenu, StatusFilterMenu, OverflowMenu — NOT React Native Modal) */
  overlaySlot?: React.ReactNode;
  /** SafeAreaView background color — default: white */
  backgroundColor?: string;
  /** Additional style for scrollContent */
  contentStyle?: ViewStyle;
  /** Override SafeAreaView root style — always last */
  style?: ViewStyle;
  /** Safe area edges to apply — default: all */
  edges?: ("top" | "bottom" | "left" | "right")[];
  /** Hide the global app logo header — default: false */
  hideAppHeader?: boolean;
  /** Wrap scroll content in KeyboardAvoidingView — use for form screens */
  keyboardAvoid?: boolean;
  /** Scroll event callback — attach for scroll-aware headers */
  onScroll?: (event: any) => void;
  /** Throttle for onScroll (ms) — default: 16 */
  scrollEventThrottle?: number;
  /** Called when user lifts finger after dragging */
  onScrollEndDrag?: (event: any) => void;
  /** Called when momentum scroll finishes */
  onMomentumScrollEnd?: (event: any) => void;
}

export function ScreenShell({
  children,
  headerSlot,
  footerSlot,
  overlaySlot,
  backgroundColor = Colors.bg.default,
  contentStyle,
  style,
  edges,
  hideAppHeader = false,
  keyboardAvoid = false,
  onScroll,
  scrollEventThrottle = 16,
  onScrollEndDrag,
  onMomentumScrollEnd,
}: Props) {
  const scrollView = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
    >
      {children}
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }, style]}
      edges={edges}
    >
      {!hideAppHeader && <AppHeader />}
      {headerSlot}
      {keyboardAvoid ? (
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {scrollView}
        </KeyboardAvoidingView>
      ) : (
        scrollView
      )}
      {footerSlot}
      {overlaySlot}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.spacing.xl,
    paddingBottom: 40,
  },
});
