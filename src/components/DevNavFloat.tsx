import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    StyleSheet,
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

  const { width: screenW, height: screenH } = Dimensions.get("window");

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
        style={[styles.fab, { left: pan.x, top: pan.y }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.fabBug}></Text>
        <Text style={styles.fabLabel}>DEV</Text>
      </Animated.View>

      {/* Dev menu modal */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardBug}></Text>
                  <Text style={styles.cardTitle}>Developer Menu</Text>
                </View>
                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setVisible(false);
                    router.push("/dev-nav");
                  }}
                >
                  <Text style={styles.menuItemEmoji}></Text>
                  <Text style={styles.menuItemText}>Manage Halaman</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItem, styles.cancelItem]}
                  activeOpacity={0.7}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.cancelText}>Tutup</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: BTN_W,
    height: BTN_H,
    borderRadius: BTN_H / 2,
    backgroundColor: "#C6FF4D",
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 999,
  },
  fabBug: {
    fontSize: 13,
  },
  fabLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.6,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    paddingBottom: 48,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  cardBug: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
  },
  menuItemEmoji: {
    fontSize: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  cancelItem: {
    marginTop: 4,
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
  },
});
