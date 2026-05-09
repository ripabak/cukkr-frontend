import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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
  /** SafeAreaView background color — default: AppTheme.colors.bg ('#EEEEE0') */
  backgroundColor?: string;
  /** Additional style for scrollContent */
  contentStyle?: ViewStyle;
  /** Override SafeAreaView root style — always last */
  style?: ViewStyle;
  /** Safe area edges to apply — default: all */
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function FormShell({
  children,
  headerSlot,
  footerSlot,
  overlaySlot,
  backgroundColor = '#EEEEE0',
  contentStyle,
  style,
  edges,
}: Props) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor }, style]}
      edges={edges}
    >
      {headerSlot}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={[{ paddingHorizontal: 20, paddingBottom: 40 }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      {footerSlot}
      {overlaySlot}
    </SafeAreaView>
  );
}
