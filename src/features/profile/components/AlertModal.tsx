import { Colors } from "@/src/theme/colors";
import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useFrame } from "@/src/components/FrameContext";

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlertModal({
  visible,
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  const { frameWidth } = useFrame();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { width: frameWidth * 0.85 }]}>
          <AppText style={styles.title}>{title}</AppText>
          {description ? (
            <AppText style={styles.description}>{description}</AppText>
          ) : null}
          {actionLabel ? (
            <TouchableOpacity
              onPress={onAction}
              activeOpacity={0.8}
              style={styles.btn}
            >
              <AppText style={styles.btnLabel}>{actionLabel}</AppText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 24,
    padding: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
  },
  btn: {
    marginTop: 24,
    height: 52,
    borderRadius: 999,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
