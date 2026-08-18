import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { SoftPressable } from "@/src/components/SoftPressable";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useFrame } from "@/src/components/FrameContext";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

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
    haptics.medium();
    onSend(reason.trim() || undefined);
  };

  const handleCancel = () => {
    haptics.light();
    setReason("");
    onCancel();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleCancel}
      title={t("bookings.confirmDecline")}
      subtitle={t("bookings.declineReasonOptional")}
    >
      <View style={[styles.body, { maxWidth: frameWidth - 40 }]}>
        <MultilineInputField
          value={reason}
          onChangeText={setReason}
          placeholder={t("bookings.declineReasonPlaceholder")}
          numberOfLines={4}
          style={styles.input}
        />
        <View style={styles.buttons}>
          <SoftPressable
            onPress={handleSend}
            haptic="medium"
            disabled={isSending}
            style={styles.btn}
            contentStyle={[
              styles.btnPrimary,
              isSending ? styles.btnDisabled : undefined,
            ]}
          >
            <AppText style={styles.btnPrimaryLabel}>
              {isSending ? t("common.saving") : t("common.send")}
            </AppText>
          </SoftPressable>
          <SoftPressable
            onPress={handleCancel}
            haptic="light"
            style={styles.btn}
            contentStyle={styles.btnSecondary}
          >
            <AppText style={styles.btnSecondaryLabel}>{t("common.cancel")}</AppText>
          </SoftPressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    width: "100%",
    paddingTop: 4,
  },
  input: {
    marginBottom: 4,
  },
  buttons: {
    marginTop: 16,
    marginBottom: 4,
    gap: 12,
  },
  btn: {
    height: 52,
    width: "100%",
  },
  btnPrimary: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPrimaryLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  btnSecondaryLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
