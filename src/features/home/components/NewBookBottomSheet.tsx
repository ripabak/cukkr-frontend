import { Colors } from "@/src/theme/colors";
import { useFrame } from "@/src/components/FrameContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const FALLBACK_PANEL_HEIGHT = 280;

export function NewBookBottomSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { frameWidth } = useFrame();
  const { width: viewportWidth } = useWindowDimensions();
  const frameOffset = (viewportWidth - frameWidth) / 2;

  const [panelHeight, setPanelHeight] = useState(FALLBACK_PANEL_HEIGHT);
  const translateY = useRef(new Animated.Value(FALLBACK_PANEL_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 14,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: panelHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.panel,
          {
            left: frameOffset,
            right: frameOffset,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY }],
          },
        ]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && h !== panelHeight) {
            setPanelHeight(h);
            if (!visible) {
              translateY.setValue(h);
            }
          }
        }}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>New Booking</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.bookingBtn}
            activeOpacity={0.75}
            onPress={() => {
              onClose();
              router.push("/d/new-walk-in");
            }}
          >
            <Ionicons
              name="walk-outline"
              size={36}
              color={Colors.text.primary}
            />
            <Text style={styles.btnLabel}>Walk-In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookingBtn}
            activeOpacity={0.75}
            onPress={() => {
              onClose();
              router.push("/d/new-appointment");
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={36}
              color={Colors.text.primary}
            />
            <Text style={styles.btnLabel}>Appointment</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: Colors.bg.overlay,
  },
  panel: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.bg.default,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.default,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  bookingBtn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
