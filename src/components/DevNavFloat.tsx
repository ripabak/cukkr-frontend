import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

/** Pill dimensions */
const BTN_W = 72;
const BTN_H = 34;
/** How many px the pill hides behind the screen edge when snapped. */
const TUCK = 20;
/** Velocity threshold to decide snap side from throw. */
const THROW_THRESHOLD = 0.4;

export function DevNavFloat() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const { height: screenH } = Dimensions.get("window");

  const posRef = useRef({ x: -TUCK, y: screenH - 160 });
  const pan = useRef(new Animated.ValueXY(posRef.current)).current;

  useEffect(() => {
    const id = pan.addListener((v) => {
      posRef.current = v;
    });
    return () => pan.removeListener(id);
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      // Claim responder on initial touch AND on move — both are needed
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(posRef.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        pan.flattenOffset();

        // Tap: minimal movement → open modal
        if (Math.abs(gs.dx) < 6 && Math.abs(gs.dy) < 6) {
          setVisible(true);
          return;
        }

        const { width: w, height: h } = Dimensions.get("window");
        const curX = posRef.current.x;
        const curY = posRef.current.y;

        // Snap side: fast throw → follow velocity, slow → follow center
        const snapRight =
          Math.abs(gs.vx) > THROW_THRESHOLD
            ? gs.vx > 0
            : curX + BTN_W / 2 > w / 2;

        const targetX = snapRight ? w - BTN_W + TUCK : -TUCK;
        const targetY = Math.max(60, Math.min(curY, h - BTN_H - 60));

        Animated.spring(pan, {
          toValue: { x: targetX, y: targetY },
          useNativeDriver: false,
          bounciness: 6,
        }).start();
      },
    }),
  ).current;

  const isVisible =
    __DEV__ || process.env.EXPO_PUBLIC_SHOW_DEV_TOOLS === "true";
  if (!isVisible) return null;

  return (
    <>
      {/* Draggable dev pill */}
      <Animated.View
        style={{ position: 'absolute', width: BTN_W, height: BTN_H, borderRadius: BTN_H / 2, backgroundColor: '#C6FF4D', borderWidth: 1.5, borderColor: '#1A1A1A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 6, zIndex: 999, left: pan.x, top: pan.y }}
        {...panResponder.panHandlers}
      >
        <Text className="text-[13px]">🐛</Text>
        <Text className="text-[11px] font-extrabold text-dark tracking-[0.6px]">DEV</Text>
      </Animated.View>

      {/* Dev menu modal */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View className="flex-1 bg-black/40 justify-end pb-[48px] px-xl">
            <TouchableWithoutFeedback>
              <View className="bg-card rounded-xl pt-lg pb-sm px-lg">
                <View className="flex-row items-center gap-[6px] mb-md px-[4px]">
                  <Text className="text-[16px]">🐛</Text>
                  <Text className="text-[13px] font-bold text-dark uppercase tracking-[0.8px]">Developer Menu</Text>
                </View>
                <TouchableOpacity
                  className="flex-row items-center gap-[10px] py-[14px] px-[4px] border-t border-[#E5E5E5]"
                  activeOpacity={0.7}
                  onPress={() => {
                    setVisible(false);
                    router.push("/dev-nav");
                  }}
                >
                  <Text className="text-[16px]">📋</Text>
                  <Text className="text-[16px] font-semibold text-dark">Manage Halaman</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-[10px] py-[14px] px-[4px] border-t border-[#E5E5E5] justify-center mt-[4px]"
                  activeOpacity={0.7}
                  onPress={() => setVisible(false)}
                >
                  <Text className="text-[16px] text-[#888888]">Tutup</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}


