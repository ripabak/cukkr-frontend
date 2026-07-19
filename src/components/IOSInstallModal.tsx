import React from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { AppTheme } from "@/src/app-theme";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function IOSInstallModal({ visible, onClose }: Props) {
  const { t } = useI18nContext();
  if (Platform.OS !== "web") return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <AppText style={styles.title}>{t("components.pwaInstall.modalTitle")}</AppText>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={AppTheme.colors.gray} />
            </TouchableOpacity>
          </View>

          <AppText style={styles.subtitle}>
            {t("components.pwaInstall.modalSubtitle")}
          </AppText>

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons
                name="share-outline"
                size={22}
                color={AppTheme.colors.accent}
              />
            </View>
            <View style={styles.stepText}>
              <AppText style={styles.stepTitle}>{t("components.pwaInstall.step1Title")}</AppText>
              <AppText style={styles.stepDesc}>
                {t("components.pwaInstall.step1Desc")}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons
                name="square-outline"
                size={22}
                color={AppTheme.colors.accent}
              />
            </View>
            <View style={styles.stepText}>
              <AppText style={styles.stepTitle}>{t("components.pwaInstall.step2Title")}</AppText>
              <AppText style={styles.stepDesc}>
                {t("components.pwaInstall.step2Desc")}
              </AppText>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <AppText style={styles.doneBtnText}>{t("components.pwaInstall.gotIt")}</AppText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: AppTheme.spacing.xl,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppTheme.colors.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: AppTheme.colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.gray,
    marginBottom: 24,
    lineHeight: 20,
  },
  step: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AppTheme.colors.dark,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: AppTheme.colors.gray,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginBottom: 16,
  },
  doneBtn: {
    marginTop: 8,
    backgroundColor: AppTheme.colors.accent,
    paddingVertical: 14,
    borderRadius: AppTheme.borderRadius.lg,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
});
