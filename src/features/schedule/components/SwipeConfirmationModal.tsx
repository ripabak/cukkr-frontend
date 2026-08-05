import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React, { useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFrame } from "@/src/components/FrameContext";

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  swipeLabel?: string;
  onComplete: () => void;
  onCancel?: () => void;
}

const SWIPE_TRACK_WIDTH = 260;
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
  const { frameWidth } = useFrame();
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
          }).start();
        }
      },
    }),
  ).current;

  const handleClose = () => {
    pan.setValue(0);
    setCompleted(false);
    onCancel?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.card, Neu.float(Colors.bg.default, 1.2), { maxWidth: frameWidth - 48 }]}
        >
          <View style={[styles.iconWrapper, Neu.accent(0.8)]}>
            <Ionicons
              name="checkmark"
              size={28}
              color={Colors.text.primary}
              style={styles.checkIcon}
            />
          </View>
          <AppText style={styles.title}>{title}</AppText>
          {description ? (
            <AppText style={styles.description}>{description}</AppText>
          ) : null}

          {/* Swipe track */}
          <View style={[styles.track, Neu.inset(Colors.bg.surface, 0.6)]}>
            <Animated.View
              style={[styles.thumb, Neu.accent(0.8), { transform: [{ translateX: pan }] }]}
              {...panResponder.panHandlers}
            >
              <Ionicons name="arrow-forward" size={22} color={Colors.text.primary} />
            </Animated.View>
            <AppText style={styles.swipeLabel}>
              {completed ? t("schedule.swipeCompleted") : resolvedSwipeLabel}
            </AppText>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.bg.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  checkIcon: {},
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  track: {
    width: SWIPE_TRACK_WIDTH,
    height: THUMB_SIZE + 8,
    borderRadius: 999,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 4,
    zIndex: 1,
  },
  swipeLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: Colors.status.success,
    marginLeft: THUMB_SIZE + 4,
  },
});
