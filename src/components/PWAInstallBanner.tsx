import React from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppTheme } from "@/src/app-theme";
import { usePWAInstall } from "@/src/hooks/usePWAInstall";
import { IOSInstallModal } from "./IOSInstallModal";

export function PWAInstallBanner() {
  const { t } = useI18nContext();
  const {
    showBanner,
    isIOS,
    isSafari,
    promptInstall,
    dismiss,
    showIOSModal,
    openIOSModal,
    closeIOSModal,
  } = usePWAInstall();

  if (Platform.OS !== "web" || !showBanner) return null;

  const handleInstall = () => {
    if (isIOS) {
      openIOSModal();
    } else {
      promptInstall();
    }
  };

  return (
    <>
      <View style={styles.banner}>
        <View style={styles.left}>
          <View style={styles.iconWrap}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.icon}
              resizeMode="cover"
            />
          </View>
          <View style={styles.textWrap}>
            <AppText style={styles.appName}>Cukkr</AppText>
            <AppText style={styles.desc}>{t("components.pwaInstall.installDesc")}</AppText>
          </View>
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            style={styles.installBtn}
            onPress={handleInstall}
            activeOpacity={0.8}
          >
            <AppText style={styles.installBtnText}>{t("components.pwaInstall.install")}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={dismiss}
            style={styles.closeBtn}
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color={AppTheme.colors.gray} />
          </TouchableOpacity>
        </View>
      </View>

      <IOSInstallModal
        visible={showIOSModal}
        isSafari={isSafari}
        onClose={closeIOSModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: AppTheme.colors.surface,
  },
  icon: {
    width: 40,
    height: 40,
  },
  textWrap: {
    flex: 1,
  },
  appName: {
    fontSize: 14,
    fontWeight: "700",
    color: AppTheme.colors.dark,
  },
  desc: {
    fontSize: 12,
    color: AppTheme.colors.gray,
    marginTop: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  installBtn: {
    backgroundColor: AppTheme.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: AppTheme.borderRadius.full,
  },
  installBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeBtn: {
    padding: 4,
  },
});
