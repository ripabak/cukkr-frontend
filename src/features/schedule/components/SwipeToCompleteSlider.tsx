import { AppText } from "@/src/components/AppText";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  label?: string;
  onComplete: () => void;
  /** Extra style for the bar (e.g. absolute footer positioning). */
  style?: ViewStyle;
}

const THUMB_SIZE = 52;
const LABEL_OFFSET = THUMB_SIZE + 4;

/**
 * The original swipe-to-complete slider (as it was inside the confirmation
 * modal) extracted into a reusable component — used both in the modal and
 * directly at the bottom of the booking detail.
 *
 * Drag works by grabbing the gold thumb, exactly like the original. The only
 * invisible additions are web guards (no text selection / native scroll while
 * dragging) so the inline usage feels the same as in the modal.
 */
export function SwipeToCompleteSlider({ label, onComplete, style }: Props) {
  const { t } = useI18nContext();
  const resolvedLabel = label ?? t("schedule.swipeToComplete");
  const pan = useRef(new Animated.Value(0)).current;
  const trackWidthRef = useRef(0);
  const doneRef = useRef(false);
  const [done, setDone] = useState(false);

  const threshold = () => Math.max(0, trackWidthRef.current - THUMB_SIZE - 16);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    haptics.success();
    onComplete();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !doneRef.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gs) => {
        if (doneRef.current) return;
        pan.setValue(Math.max(0, Math.min(gs.dx, threshold())));
      },
      onPanResponderRelease: (_, gs) => {
        if (doneRef.current) return;
        if (gs.dx >= threshold()) {
          Animated.timing(pan, {
            toValue: threshold(),
            duration: 100,
            useNativeDriver: false,
          }).start(() => finish());
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
            stiffness: 240,
            damping: 22,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View
      style={[styles.track, style]}
      onLayout={(e) => {
        trackWidthRef.current = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <Ionicons name="arrow-forward" size={22} color={Colors.brand.primary} />
      </Animated.View>
      <AppText style={styles.swipeLabel} numberOfLines={1}>
        {done ? t("schedule.swipeCompleted") : resolvedLabel}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: "stretch",
    height: THUMB_SIZE + 8,
    borderRadius: 999,
    backgroundColor: Colors.status.success,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 8,
    // Web guards — keep the drag from triggering text selection / native scroll.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore react-native-web allows touchAction/userSelect on styles
    touchAction: "none",
    userSelect: "none",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 4,
    zIndex: 1,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore react-native-web allows userSelect on styles
    userSelect: "none",
  },
  swipeLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: Colors.bg.surface,
    marginLeft: LABEL_OFFSET,
  },
});
