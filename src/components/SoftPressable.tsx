import { haptics, type HapticKind } from "@/src/utils/haptics";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props extends Omit<PressableProps, "style"> {
  /** Outer wrapper style (size, margins). */
  style?: StyleProp<ViewStyle>;
  /** Surface style applied to the pressable (bg, radius, centering, borders). */
  contentStyle?: StyleProp<ViewStyle>;
  /** Haptic fired on press-in. Pass null to disable. Default: "light". */
  haptic?: HapticKind | null;
  /** Scale applied while pressed. Default: 0.97. */
  scaleTo?: number;
  children: React.ReactNode;
}

/**
 * Tactile pressable with a physical "push" feel: springs to `scaleTo` on
 * press-in, springs back on release, and fires a light haptic.
 *
 * Replaces bare TouchableOpacity for key interactive surfaces.
 */
export function SoftPressable({
  style,
  contentStyle,
  haptic = "light",
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (
    e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0],
  ) => {
    if (haptic) haptics[haptic]();
    Animated.spring(scale, {
      toValue: scaleTo,
      stiffness: 400,
      damping: 18,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (
    e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0],
  ) => {
    Animated.spring(scale, {
      toValue: 1,
      stiffness: 300,
      damping: 16,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        {...rest}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.fill, contentStyle, disabled && styles.disabled]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  disabled: {
    opacity: 0.45,
  },
});
