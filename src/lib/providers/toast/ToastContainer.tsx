import { useFrame } from "@/src/components/FrameContext";
import React, { useEffect, useRef } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useToastContext } from "./ToastContext";

const TOAST_HEIGHT = 60;

interface AnimatedToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onDismiss: () => void;
  frameWidth: number;
}

function AnimatedToast({
  message,
  type,
  onDismiss,
  frameWidth,
}: AnimatedToastProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [translateY, opacity]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -TOAST_HEIGHT - 20,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(onDismiss);
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#34C759";
      case "error":
        return "#FF3B30";
      case "warning":
        return "#FF9500";
      case "info":
      default:
        return "#1A1A1A";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "\u2713";
      case "error":
        return "\u2715";
      case "warning":
        return "\u26A0";
      case "info":
      default:
        return "\u2139";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          maxWidth: frameWidth,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDismiss}
        style={[styles.toast, { backgroundColor: getBackgroundColor() }]}
      >
        <AppText style={styles.icon}>{getIcon()}</AppText>
        <AppText style={styles.message} numberOfLines={2}>
          {message}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, hideToast } = useToastContext();
  const { frameWidth } = useFrame();

  return (
    <View style={[styles.root, { pointerEvents: "box-none" }]}>
      {toasts.map((toast) => (
        <AnimatedToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => hideToast(toast.id)}
          frameWidth={frameWidth}
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
    paddingTop: Platform.OS === "web" ? 8 : 0,
  },
  container: {
    height: TOAST_HEIGHT,
    marginBottom: 8,
    width: "100%",
    paddingHorizontal: 16,
  },
  toast: {
    flex: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    fontSize: 18,
    color: "#FFFFFF",
    marginRight: 12,
    fontWeight: "600",
  },
  message: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
