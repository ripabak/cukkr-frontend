import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useFrame } from "./FrameContext";
import { Neu } from "@/src/theme/styles";

interface Props {
  visible: boolean;
  icon?: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmationModal({
  visible,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const { frameWidth } = useFrame();
  const hasBoth = !!confirmLabel && !!cancelLabel;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, Neu.float(Colors.bg.surface, 1.2), { width: frameWidth * 0.85 }]}>
          {icon ? (
            <View style={[styles.iconWrapper, Neu.soft(Colors.brand.primarySurface)]}>
              <Ionicons
                name={icon as React.ComponentProps<typeof Ionicons>["name"]}
                size={28}
                color={Colors.brand.primaryDark}
              />
            </View>
          ) : null}
          <AppText style={styles.title}>{title}</AppText>
          {description ? (
            <AppText style={styles.description}>{description}</AppText>
          ) : null}
          <View style={[styles.buttons, hasBoth && styles.buttonsRow]}>
            {cancelLabel ? (
              <TouchableOpacity
                onPress={onCancel}
                activeOpacity={0.85}
                style={[styles.btn, Neu.soft(Colors.bg.surface), hasBoth && styles.btnFlex]}
              >
                <AppText style={styles.btnDarkLabel}>{cancelLabel}</AppText>
              </TouchableOpacity>
            ) : null}
            {confirmLabel ? (
              <TouchableOpacity
                onPress={onConfirm}
                activeOpacity={0.85}
                style={[
                  styles.btn,
                  Neu.accent(),
                  hasBoth && styles.btnFlex,
                ]}
              >
                <AppText style={styles.btnOutlineLabel}>{confirmLabel}</AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.bg.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 24,
    padding: 28,
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
    width: "100%",
  },
  buttonsRow: {
    flexDirection: "row",
  },
  btn: {
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  btnFlex: {
    flex: 1,
  },
  btnDarkLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  btnOutlineLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
