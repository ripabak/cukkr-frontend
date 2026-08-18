import { AppText } from "@/src/components/AppText";
import { useFrame } from "@/src/components/FrameContext";
import { Colors } from "@/src/theme/colors";
import { Soft } from "@/src/theme/styles";
import { haptics } from "@/src/utils/haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Called after a drag / backdrop / hardware dismiss animation finishes. */
  onDismissed?: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Show the grab handle. Default true. */
  showHandle?: boolean;
  /**
   * Content contains a ScrollView: the drag-to-dismiss gesture is then only
   * available on the handle / header zone so scrolling keeps working.
   * Default false (whole panel is a drag surface).
   */
  scrollable?: boolean;
  /** Max height as a fraction of the viewport. Default 0.9. */
  maxHeightFraction?: number;
  dismissible?: boolean;
}

const DISMISS_FRACTION = 0.26; // drag distance (of panel height) to dismiss
const DISMISS_VELOCITY = 0.85; // fling velocity (pts/ms) to dismiss

/**
 * Interactive bottom sheet with real-time gesture drag-to-dismiss.
 *
 * - Springs up from the bottom with a dimmed scrim.
 * - Dragging down moves the sheet 1:1 with the finger; the scrim fades in
 *   real time as you drag.
 * - Release past 26% of the height (or a fast fling) dismisses with the
 *   leftover velocity; otherwise it springs back.
 * - Tap the scrim, drag, or hardware back to dismiss. Every close path runs
 *   the same slide-out animation because the exit is driven by the `visible`
 *   prop flip.
 */
export function BottomSheet({
  visible,
  onClose,
  onDismissed,
  title,
  subtitle,
  children,
  showHandle = true,
  scrollable = false,
  maxHeightFraction = 0.9,
  dismissible = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const { frameWidth } = useFrame();
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const frameOffset = (viewportWidth - frameWidth) / 2;

  const [panelHeight, setPanelHeight] = useState(0);
  const [presented, setPresented] = useState(false);
  const heightRef = useRef(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Real-time drag-to-dismiss gesture.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx) * 1.25,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, gs) => {
        const dy = Math.max(0, gs.dy);
        // 1:1 finger tracking with slight resistance past half height.
        const resisted =
          dy > heightRef.current * 0.5
            ? heightRef.current * 0.5 + (dy - heightRef.current * 0.5) * 0.35
            : dy;
        translateY.setValue(resisted);
        backdropOpacity.setValue(Math.max(0, 1 - resisted / heightRef.current));
      },
      onPanResponderRelease: (_, gs) => {
        const dy = Math.max(0, gs.dy);
        const shouldDismiss =
          dy > heightRef.current * DISMISS_FRACTION || gs.vy > DISMISS_VELOCITY;
        if (shouldDismiss) {
          haptics.light();
          dismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            stiffness: 220,
            damping: 24,
            mass: 0.8,
            useNativeDriver: true,
          }).start();
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 160,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          stiffness: 220,
          damping: 24,
          mass: 0.8,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const dismiss = useCallback(() => {
    onClose();
    onDismissed?.();
  }, [onClose, onDismissed]);

  // Present / dismiss on visibility changes. The exit animation runs on the
  // prop flip, so every close path (button, scrim tap, drag, hardware back)
  // slides the sheet out smoothly.
  useEffect(() => {
    if (visible) {
      setPresented(true);
      haptics.light();
      translateY.setValue(heightRef.current || 320);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          stiffness: 260,
          damping: 28,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      const height = heightRef.current || 320;
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 40,
          duration: 230,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 210,
          useNativeDriver: true,
        }),
      ]).start(() => setPresented(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleLayout = (e: { nativeEvent: { layout: { height: number } } }) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== heightRef.current) {
      heightRef.current = h;
      setPanelHeight(h);
      if (!presented) translateY.setValue(h);
    }
  };

  if (!presented) return null;

  const maxHeight = Math.round(viewportHeight * maxHeightFraction);
  const dragHandlers = scrollable ? {} : panResponder.panHandlers;

  return (
    <Modal
      visible={presented}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={() => {
        if (dismissible) dismiss();
      }}
    >
      {/* Scrim — tap to dismiss */}
      <TouchableWithoutFeedback
        onPress={() => {
          if (dismissible) dismiss();
        }}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.panel,
          Soft.float(Colors.bg.elevated, 1),
          {
            left: frameOffset,
            right: frameOffset,
            maxHeight,
            paddingBottom: insets.bottom + 14,
            transform: [{ translateY }],
          },
        ]}
        onLayout={handleLayout}
        {...dragHandlers}
      >
        {/* Grab zone — always draggable, even in scrollable sheets */}
        <View
          style={styles.grabZone}
          {...(scrollable ? panResponder.panHandlers : {})}
        >
          {showHandle ? <View style={styles.handle} /> : null}
          {title || subtitle ? (
            <View style={styles.header}>
              {title ? (
                <AppText style={styles.title} numberOfLines={1}>
                  {title}
                </AppText>
              ) : null}
              {subtitle ? (
                <AppText style={styles.subtitle} numberOfLines={2}>
                  {subtitle}
                </AppText>
              ) : null}
            </View>
          ) : null}
        </View>

        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bg.overlay,
  },
  panel: {
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  grabZone: {
    alignItems: "center",
    paddingBottom: 2,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border.default,
    marginBottom: 12,
  },
  header: {
    alignSelf: "stretch",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
});
