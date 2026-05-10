import { useFrame } from "@/src/components/FrameContext";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
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

function AnimatedToast({ message, type, onDismiss, frameWidth }: AnimatedToastProps) {
  const slideAnim = React.useRef(new Animated.Value(-TOAST_HEIGHT - 20)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -TOAST_HEIGHT - 20,
      duration: 300,
      useNativeDriver: true,
    }).start(onDismiss);
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
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }], maxWidth: frameWidth },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDismiss}
        style={[styles.toast, { backgroundColor: getBackgroundColor() }]}
      >
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, hideToast } = useToastContext();
  const { frameWidth } = useFrame();
  const [displayedToasts, setDisplayedToasts] = useState(toasts.slice(-1));

  useEffect(() => {
    setDisplayedToasts(toasts.slice(-1));
  }, [toasts]);

  return (
    <View style={[styles.root, { pointerEvents: "box-none" }]} >
      {displayedToasts.map((toast) => (
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
    position: Platform.OS === "web" ? ("fixed") : "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
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
