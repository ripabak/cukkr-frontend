import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
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
      <TouchableOpacity className="flex-1 bg-black/30 justify-center items-center px-xxl" activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity activeOpacity={1} className="bg-card rounded-[24px] p-[28px] w-full items-center">
          <View className="w-14 h-14 rounded-full bg-[#55C46B] items-center justify-center mb-lg">
            <Ionicons name="checkmark" size={28} color="#FFFFFF" />
          </View>
          <Text className="text-[20px] font-bold text-dark text-center mb-sm">{title}</Text>
          {description ? <Text className="text-[13px] text-gray text-center leading-[18px] mb-xxl">{description}</Text> : null}

          {/* Swipe track */}
          <View
            style={{ width: SWIPE_TRACK_WIDTH, height: THUMB_SIZE + 8, backgroundColor: '#F0F0E8', borderRadius: 999, justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 8 }}
          >
            <Animated.View
              style={[{ width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2, backgroundColor: '#55C46B', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 4, zIndex: 1 }, { transform: [{ translateX: pan }] }]}
              {...panResponder.panHandlers}
            >
              <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
            </Animated.View>
            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '500', color: '#55C46B', marginLeft: THUMB_SIZE + 4 }}>{completed ? 'Completed!' : swipeLabel}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}


