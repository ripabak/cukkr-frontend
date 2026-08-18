import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { SoftPressable } from "@/src/components/SoftPressable";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  memberName: string;
  currentRole: string;
  onSave: (newRole: "admin" | "member") => void;
  onCancel: () => void;
}

type TFunction = (key: string, params?: Record<string, string>) => string;

function getRoleOptions(
  t: TFunction,
): { value: "admin" | "member"; label: string; icon: string }[] {
  return [
    { value: "admin", label: t("barbers.admin"), icon: "shield-checkmark" },
    { value: "member", label: t("barbers.member"), icon: "person" },
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
  const initialRole = currentRole === "admin" ? "admin" : "member";
  const [selectedRole, setSelectedRole] = useState<"admin" | "member">(initialRole);
  const hasChanged = selectedRole !== initialRole;

  const handleSave = () => {
    haptics.medium();
    onSave(selectedRole);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={() => {
        haptics.light();
        onCancel();
      }}
      title={t("barbers.changeRole")}
      subtitle={memberName}
    >
      <View style={styles.body}>
        <View style={styles.currentRoleRow}>
          <AppText style={styles.currentRoleLabel}>
            {t("barbers.currentRole", {
              role:
                currentRole.charAt(0).toUpperCase() + currentRole.slice(1),
            })}
          </AppText>
        </View>

        <View style={styles.optionsRow}>
          {getRoleOptions(t).map((opt) => {
            const isSelected = selectedRole === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  haptics.selection();
                  setSelectedRole(opt.value);
                }}
                activeOpacity={0.8}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <View
                  style={[
                    styles.optionIconChip,
                    isSelected && styles.optionIconSelected,
                  ]}
                >
                  <Ionicons
                    name={opt.icon as React.ComponentProps<typeof Ionicons>["name"]}
                    size={22}
                    color={isSelected ? Colors.text.primary : Colors.text.secondary}
                  />
                </View>
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
          <SoftPressable
            onPress={() => {
              haptics.light();
              onCancel();
            }}
            style={styles.btn}
            contentStyle={styles.btnSecondary}
          >
            <AppText style={styles.btnSecondaryText}>{t("common.cancel")}</AppText>
          </SoftPressable>
          <SoftPressable
            onPress={handleSave}
            haptic="medium"
            disabled={!hasChanged}
            style={styles.btn}
            contentStyle={[
              !hasChanged ? styles.btnSaveDisabled : styles.btnPrimary,
            ]}
          >
            <AppText style={styles.btnPrimaryText}>{t("common.save")}</AppText>
          </SoftPressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 4,
  },
  currentRoleRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  currentRoleLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.muted,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.bg.surface,
    paddingVertical: 18,
    alignItems: "center",
    gap: 8,
  },
  optionSelected: {
    backgroundColor: Colors.brand.primarySurface,
    borderColor: Colors.brand.primary,
  },
  optionIconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconSelected: {
    backgroundColor: Colors.brand.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  optionTextSelected: {
    color: Colors.text.primary,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  btn: {
    flex: 1,
    height: 52,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: Colors.brand.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSaveDisabled: {
    flex: 1,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
