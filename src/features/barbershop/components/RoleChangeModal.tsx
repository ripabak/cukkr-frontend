import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useFrame } from "@/src/components/FrameContext";

interface Props {
  visible: boolean;
  memberName: string;
  currentRole: string;
  onSave: (newRole: "admin" | "member") => void;
  onCancel: () => void;
}

type TFunction = (key: string, params?: Record<string, string>) => string;

function getRoleOptions(t: TFunction): { value: "admin" | "member"; label: string }[] {
  return [
    { value: "admin", label: t("barbers.admin") },
    { value: "member", label: t("barbers.member") },
  ];
}

export function RoleChangeModal({
  visible,
  memberName,
  currentRole,
  onSave,
  onCancel,
}: Props) {
  const { t } = useI18nContext();
  const { frameWidth } = useFrame();
  const initialRole = currentRole === "admin" ? "admin" : "member";
  const [selectedRole, setSelectedRole] = useState<"admin" | "member">(initialRole);
  const hasChanged = selectedRole !== initialRole;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { width: frameWidth * 0.85 }]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="shield-checkmark-outline" size={32} color={Colors.text.primary} />
          </View>

          <AppText style={styles.title}>{t("barbers.changeRole")}</AppText>
          <AppText style={styles.description}>
            {memberName}
          </AppText>
          <AppText style={styles.currentRole}>
            {t("barbers.currentRole", { role: currentRole.charAt(0).toUpperCase() + currentRole.slice(1) })}
          </AppText>

          <View style={styles.optionsRow}>
            {getRoleOptions(t).map((opt) => {
              const isSelected = selectedRole === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSelectedRole(opt.value)}
                  activeOpacity={0.8}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                  ]}
                >
                  <AppText
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              style={[styles.btn, styles.btnCancel]}
            >
              <AppText style={styles.btnCancelText}>{t("common.cancel")}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSave(selectedRole)}
              activeOpacity={0.8}
              disabled={!hasChanged}
              style={[
                styles.btn,
                styles.btnSave,
                !hasChanged && styles.btnSaveDisabled,
              ]}
            >
              <AppText
                style={[
                  styles.btnSaveText,
                  !hasChanged && styles.btnSaveTextDisabled,
                ]}
              >
                {t("common.save")}
              </AppText>
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
    marginTop: 4,
  },
  currentRole: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primarySurface,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  optionTextSelected: {
    color: Colors.brand.primary,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancel: {
    borderWidth: 1.5,
    borderColor: Colors.border.default,
  },
  btnCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  btnSave: {
    backgroundColor: Colors.brand.primary,
  },
  btnSaveDisabled: {
    opacity: 0.4,
  },
  btnSaveText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  btnSaveTextDisabled: {
    color: Colors.text.primary,
  },
});
