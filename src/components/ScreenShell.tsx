import AppTheme from "@/src/app-theme";
import { Colors } from "@/src/theme/colors";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  /** Sticky element rendered ABOVE the ScrollView (e.g. ScreenHeader, custom topBar) */
  headerSlot?: React.ReactNode;
  /** Sticky element rendered BELOW the ScrollView (e.g. BottomTabBar, StickyCta) */
  footerSlot?: React.ReactNode;
  /** Absolutely-positioned overlays (SortMenu, StatusFilterMenu, OverflowMenu — NOT React Native Modal) */
  overlaySlot?: React.ReactNode;
  /** SafeAreaView background color — default: soft gray */
  backgroundColor?: string;
  /** Additional style for scrollContent */
  contentStyle?: ViewStyle;
  /** Override SafeAreaView root style — always last */
  style?: ViewStyle;
  /** Safe area edges to apply — default: all */
  edges?: ("top" | "bottom" | "left" | "right")[];
  /** Wrap scroll content in KeyboardAvoidingView — use for form screens */
  keyboardAvoid?: boolean;
  /**
   * Render headerSlot as an absolute overlay above the ScrollView so it can
   * collapse on scroll (drive the transform from `onScroll`).
   * Content is top-padded by `stickyHeaderHeight` so it clears the header.
   */
  stickyHeader?: boolean;
  /** Measured height of the header slot (used for the content top-pad & collapse math). */
  stickyHeaderHeight?: number;
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
  keyboardAvoid = false,
  stickyHeader = false,
  stickyHeaderHeight = 0,
  onScroll,
  scrollEventThrottle = 16,
  onScrollEndDrag,
  onMomentumScrollEnd,
}: Props) {
  const insets = useSafeAreaInsets();

  const scrollView = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        stickyHeader ? { paddingTop: stickyHeaderHeight } : null,
        contentStyle,
      ]}
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
      {headerSlot ? (
        <View
          style={[
            styles.headerSlotWrapper,
            stickyHeader && [styles.stickyHeaderWrapper, { top: insets.top }],
          ]}
        >
          {headerSlot}
        </View>
      ) : null}
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
  headerSlotWrapper: {
    position: "relative",
    zIndex: 100,
  },
  stickyHeaderWrapper: {
    // Transparent by design: the collapsible header paints its own
    // background on the animated element so no white band lingers behind
    // once it slides away.
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: AppTheme.spacing.xl,
    paddingBottom: 40,
  },
});
