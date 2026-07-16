import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useFrame } from "./FrameContext";

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
        <View style={[styles.card, { width: frameWidth * 0.85 }]}>
          {icon ? (
            <View style={styles.iconWrapper}>
              <Ionicons
                name={icon as React.ComponentProps<typeof Ionicons>["name"]}
                size={32}
                color={Colors.text.primary}
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
                activeOpacity={0.8}
                style={[styles.btn, styles.btnDark, hasBoth && styles.btnFlex]}
              >
                <AppText style={styles.btnDarkLabel}>{cancelLabel}</AppText>
              </TouchableOpacity>
            ) : null}
            {confirmLabel ? (
              <TouchableOpacity
                onPress={onConfirm}
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  styles.btnOutline,
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
    backgroundColor: Colors.bg.default,
    borderRadius: 24,
    padding: 28,
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 16,
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
  buttons: {
    marginTop: 24,
    gap: 12,
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
  btnDark: {
    backgroundColor: Colors.brand.primary,
  },
  btnDarkLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.border.default,
  },
  btnOutlineLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
