import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
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
} from "react-native";

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  swipeLabel?: string;
  onComplete: () => void;
  onCancel?: () => void;
}

const SWIPE_TRACK_WIDTH = 280;
const THUMB_SIZE = 52;
const SWIPE_THRESHOLD = SWIPE_TRACK_WIDTH - THUMB_SIZE - 16;

export function SwipeConfirmationModal({
  visible,
  title,
  description,
  swipeLabel,
  onComplete,
  onCancel,
}: Props) {
  const { t } = useI18nContext();
  const resolvedSwipeLabel = swipeLabel ?? t("schedule.swipeToComplete");
  const pan = useRef(new Animated.Value(0)).current;
  const [completed, setCompleted] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        const clampedX = Math.max(0, Math.min(gs.dx, SWIPE_THRESHOLD));
        pan.setValue(clampedX);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx >= SWIPE_THRESHOLD) {
          haptics.success();
          Animated.timing(pan, {
            toValue: SWIPE_THRESHOLD,
            duration: 100,
            useNativeDriver: false,
          }).start(() => {
            setCompleted(true);
            onComplete();
          });
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

  const handleClose = () => {
    pan.setValue(0);
    setCompleted(false);
    haptics.light();
    onCancel?.();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
    >
      <View style={styles.body}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name="checkmark"
            size={26}
            color={Colors.text.primary}
          />
        </View>
        <AppText style={styles.title}>{title}</AppText>
        {description ? (
          <AppText style={styles.description}>{description}</AppText>
        ) : null}

        {/* Swipe track */}
        <View style={styles.trackWrap}>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.thumb,
                { transform: [{ translateX: pan }] },
              ]}
              {...panResponder.panHandlers}
            >
              <Ionicons
                name="arrow-forward"
                size={22}
                color={Colors.text.primary}
              />
            </Animated.View>
            <AppText style={styles.swipeLabel} numberOfLines={1}>
              {completed ? t("schedule.swipeCompleted") : resolvedSwipeLabel}
            </AppText>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 8,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.brand.primarySurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 300,
  },
  trackWrap: {
    alignSelf: "center",
    marginBottom: 8,
  },
  track: {
    width: SWIPE_TRACK_WIDTH,
    height: THUMB_SIZE + 8,
    borderRadius: 999,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.light,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 4,
    zIndex: 1,
  },
  swipeLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: Colors.status.success,
    marginLeft: THUMB_SIZE + 4,
  },
});
