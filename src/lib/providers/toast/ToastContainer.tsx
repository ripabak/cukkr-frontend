import { AppText } from "@/src/components/AppText";
import { useFrame } from "@/src/components/FrameContext";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { USE_NATIVE_DRIVER } from "@/src/utils/nativeDriver";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastContext } from "./ToastContext";
import type { Toast, ToastType } from "./ToastContext";

/* Color + icon per semantic kind. The icon is always a white solid fill on a
 * colored circle; the icon/color pair is the whole visual identity. */
const TYPE_META: Record<
  ToastType,
  { color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  neutral: { color: Colors.status.neutral, icon: "notifications" },
  success: { color: Colors.status.success, icon: "checkmark-circle" },
  info: { color: Colors.status.info, icon: "information-circle" },
  warning: { color: Colors.status.warning, icon: "alert-circle" },
  error: { color: Colors.status.danger, icon: "close-circle" },
};

interface AnimatedToastProps {
  toast: Toast;
  onDismiss: () => void;
  toastWidth: number;
}

/** Single toast with enter animation, auto-dismiss timer, and exit animation. */
function AnimatedToast({ toast, onDismiss, toastWidth }: AnimatedToastProps) {
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.97)).current;
  const meta = TYPE_META[toast.type] ?? TYPE_META.neutral;

  const doExit = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -24,
        duration: 220,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(scale, { toValue: 0.97, duration: 200, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start(onDismiss);
  };

  const doEnter = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        stiffness: 320,
        damping: 26,
        mass: 0.9,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.spring(scale, {
        toValue: 1,
        stiffness: 320,
        damping: 26,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start();
  };

  useEffect(() => {
    doEnter();
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      const t = setTimeout(doExit, duration);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { width: toastWidth, maxWidth: "100%" },
        {
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Pressable
        onPress={doExit}
        style={({ pressed }) => [
          styles.card,
          // Tanpa description: title di-center vertikal. Dengan description:
          // icon & title di atas, description menjorok di bawahnya.
          { alignItems: toast.description ? "flex-start" : "center" },
          pressed && styles.cardPressed,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: meta.color }]}>
          <Ionicons name={meta.icon} size={19} color="#FFFFFF" />
        </View>

        <View style={styles.textCol}>
          <AppText style={styles.title} numberOfLines={1}>
            {toast.title}
          </AppText>
          {toast.description ? (
            <AppText style={styles.description} numberOfLines={2}>
              {toast.description}
            </AppText>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          hitSlop={10}
          onPress={doExit}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={18} color={Colors.icon.muted} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, hideToast } = useToastContext();
  const { frameWidth } = useFrame();
  const insets = useSafeAreaInsets();
  const toastWidth = Math.max(frameWidth - 32, 260);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Platform.OS === "web" ? 12 : insets.top + 4,
          pointerEvents: "box-none",
        },
      ]}
    >
      {toasts.map((toast) => (
        <AnimatedToast
          key={toast.id}
          toast={toast}
          onDismiss={() => hideToast(toast.id)}
          toastWidth={toastWidth}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
  },
  wrapper: {
    marginBottom: 8,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: Colors.bg.default, // solid white base (kept in dark mode too)
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.default,
    flexDirection: "row",
    padding: 12,
    gap: 10,
    // soft elevation
    ...Platform.select({
      web: {
        boxShadow:
          "0 1px 2px rgba(23, 28, 35, 0.04), 0 10px 30px rgba(23, 28, 35, 0.12)",
      },
      default: {
        shadowColor: "#171c23",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      },
    }),
  },
  cardPressed: {
    opacity: 0.94,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  textCol: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "600",
    lineHeight: 20,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.text.secondary,
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});
