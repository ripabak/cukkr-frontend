import { useI18nContext } from "@/src/lib/i18n/provider";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { Colors } from "@/src/theme/colors";
import React, { useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useFrame } from "@/src/components/FrameContext";

interface Props {
  visible: boolean;
  onSend: (reason?: string) => void;
  onCancel: () => void;
  isSending: boolean;
}

export function DeclineReasonModal({
  visible,
  onSend,
  onCancel,
  isSending,
}: Props) {
  const { t } = useI18nContext();
  const { frameWidth } = useFrame();
  const [reason, setReason] = useState("");

  const handleSend = () => {
    onSend(reason.trim() || undefined);
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { width: frameWidth * 0.85 }]}>
          <AppText style={styles.title}>{t("bookings.confirmDecline")}</AppText>
          <AppText style={styles.subtitle}>
            {t("bookings.declineReasonOptional")}
          </AppText>
          <MultilineInputField
            value={reason}
            onChangeText={setReason}
            placeholder={t("bookings.declineReasonPlaceholder")}
            numberOfLines={4}
            style={styles.input}
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={isSending}
              style={[
                styles.btn,
                styles.btnPrimary,
                isSending && styles.btnDisabled,
              ]}
            >
              <AppText style={styles.btnPrimaryLabel}>
                {isSending ? t("common.saving") : t("common.send")}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.8}
              style={[styles.btn, styles.btnOutline]}
            >
              <AppText style={styles.btnOutlineLabel}>{t("common.cancel")}</AppText>
            </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  buttons: {
    marginTop: 20,
    gap: 12,
  },
  btn: {
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: Colors.brand.primary,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPrimaryLabel: {
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
