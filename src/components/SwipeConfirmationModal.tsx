import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  swipeLabel = 'Swipe to complete',
  onComplete,
  onCancel,
}: Props) {
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
    })
  ).current;

  const handleClose = () => {
    pan.setValue(0);
    setCompleted(false);
    onCancel?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity activeOpacity={1} style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons name="checkmark" size={28} color="#FFFFFF" style={styles.checkIcon} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}

          {/* Swipe track */}
          <View style={styles.track}>
            <Animated.View
              style={[styles.thumb, { transform: [{ translateX: pan }] }]}
              {...panResponder.panHandlers}
            >
              <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.swipeLabel}>{completed ? 'Completed!' : swipeLabel}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#55C46B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkIcon: {},
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  track: {
    width: SWIPE_TRACK_WIDTH,
    height: THUMB_SIZE + 8,
    backgroundColor: '#F0F0E8',
    borderRadius: 999,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#55C46B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 4,
    zIndex: 1,
  },
  swipeLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#55C46B',
    marginLeft: THUMB_SIZE + 4,
  },
});
