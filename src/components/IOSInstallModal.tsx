import React, { useState, useMemo } from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  ImageSourcePropType,
} from "react-native";
import { AppTheme } from "@/src/app-theme";
import { Ionicons } from "@expo/vector-icons";

const IMAGES = {
  step1New: require("@/public/screenshots/ios-install/share-button-new.png"),
  step1Old: require("@/public/screenshots/ios-install/share-button-old.jpg"),
  step1Variant: require("@/public/screenshots/ios-install/3-dots-new.png"),
  step2New: require("@/public/screenshots/ios-install/add-to-home-new.png"),
  step2Old: require("@/public/screenshots/ios-install/add-to-home-button-old.png"),
  appInstalled: require("@/public/screenshots/ios-install/app-installed.png"),
  safariIcon: require("@/public/screenshots/ios-install/safari-icon.png"),
};

const IMAGE_ASPECT: Record<string, number> = {
  step1New: 477 / 267,
  step1Old: 1568 / 672,
  step1Variant: 750 / 197,
  step2New: 750 / 120,
  step2Old: 384 / 66,
  appInstalled: 432 / 476,
  safariIcon: 1,
};

const STEP_FALLBACK_ICON: Record<StepKey, keyof typeof Ionicons.glyphMap> = {
  step1: "share-outline",
  step2: "add-circle-outline",
  step3: "home-outline",
};

const STEP_I18N: Record<
  StepKey,
  { title: string; desc: string; variant: string }
> = {
  step1: {
    title: "components.pwaInstall.step1Title",
    desc: "components.pwaInstall.step1Desc",
    variant: "components.pwaInstall.step1Variant",
  },
  step2: {
    title: "components.pwaInstall.step2Title",
    desc: "components.pwaInstall.step2Desc",
    variant: "components.pwaInstall.step2Variant",
  },
  step3: {
    title: "components.pwaInstall.step3Title",
    desc: "components.pwaInstall.step3Desc",
    variant: "components.pwaInstall.step3Variant",
  },
};

interface Props {
  visible: boolean;
  isSafari: boolean;
  onClose: () => void;
}

type StepKey = "step1" | "step2" | "step3";

const STEPS: StepKey[] = ["step1", "step2", "step3"];

function getImageSource(
  step: StepKey,
  isNewSafari: boolean,
): { source: ImageSourcePropType | null; aspect: number; variantSource?: ImageSourcePropType; variantAspect?: number } {
  switch (step) {
    case "step1":
      return {
        source: isNewSafari ? IMAGES.step1New : IMAGES.step1Old,
        aspect: isNewSafari ? IMAGE_ASPECT.step1New : IMAGE_ASPECT.step1Old,
        variantSource: IMAGES.step1Variant,
        variantAspect: IMAGE_ASPECT.step1Variant,
      };
    case "step2":
      return {
        source: isNewSafari ? IMAGES.step2New : IMAGES.step2Old,
        aspect: isNewSafari ? IMAGE_ASPECT.step2New : IMAGE_ASPECT.step2Old,
      };
    case "step3":
      return { source: null, aspect: 0 };
  }
}

function StepImage({
  source,
  aspect,
  step,
}: {
  source: ImageSourcePropType;
  aspect: number;
  step: StepKey;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <View style={styles.stepImageFallback}>
        <Ionicons
          name={STEP_FALLBACK_ICON[step]}
          size={32}
          color={AppTheme.colors.accent}
        />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={[styles.stepImage, { aspectRatio: aspect }]}
      resizeMode="contain"
      onError={() => setErrored(true)}
    />
  );
}

function isNewSafariBrowser(): boolean {
  if (typeof navigator === "undefined") return true;
  const ua = navigator.userAgent;
  if (!/safari/i.test(ua)) return true;
  if (/crios|fxios|edgios|opios/i.test(ua)) return true;
  const match = ua.match(/version\/(\d+)/i);
  if (!match) return true;
  return parseInt(match[1], 10) >= 15;
}

export function IOSInstallModal({ visible, isSafari, onClose }: Props) {
  const { t } = useI18nContext();
  const isNewSafari = useMemo(() => isNewSafariBrowser(), []);

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
            <View style={styles.headerLeft}>
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color={AppTheme.colors.accent}
              />
              <AppText style={styles.title}>{t("components.pwaInstall.modalTitle")}</AppText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={AppTheme.colors.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.safariHeader}>
              <Image
                source={IMAGES.safariIcon}
                style={styles.safariIcon}
                resizeMode="contain"
              />
              <View style={styles.safariHeaderTextWrap}>
                <AppText style={styles.safariHeaderTitle}>
                  {t("components.pwaInstall.safariHeaderTitle")}
                </AppText>
                <AppText style={styles.safariHeaderDesc}>
                  {t("components.pwaInstall.safariHeaderDesc")}
                </AppText>
              </View>
            </View>

            {STEPS.map((step, index) => {
              const i18n = STEP_I18N[step];
              const { source, aspect, variantSource, variantAspect } = getImageSource(step, isNewSafari && isSafari);
              return (
                <View key={step}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.stepContainer}>
                    <View style={styles.stepNumber}>
                      <AppText style={styles.stepNumberText}>{index + 1}</AppText>
                    </View>
                    <View style={styles.stepContent}>
                      <AppText style={styles.stepTitle}>{t(i18n.title)}</AppText>
                      {source && <StepImage source={source} aspect={aspect} step={step} />}
                      <AppText style={styles.stepDesc}>{t(i18n.desc)}</AppText>
                      <View style={styles.variantRow}>
                        <Ionicons name="bulb-outline" size={13} color={AppTheme.colors.accent} />
                        <AppText style={styles.variantText}>{t(i18n.variant)}</AppText>
                      </View>
                      {variantSource && variantAspect && (
                        <View style={styles.variantImageWrap}>
                          <Image
                            source={variantSource}
                            style={[styles.variantImage, { aspectRatio: variantAspect }]}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={styles.divider} />

            <View style={styles.successSection}>
              <Image
                source={IMAGES.appInstalled}
                style={[styles.successImage, { aspectRatio: IMAGE_ASPECT.appInstalled }]}
                resizeMode="contain"
              />
              <AppText style={styles.successText}>
                {t("components.pwaInstall.installSuccess")}
              </AppText>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <AppText style={styles.doneBtnText}>{t("components.pwaInstall.gotIt")}</AppText>
            </TouchableOpacity>
          </ScrollView>
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
    backgroundColor: AppTheme.colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: AppTheme.spacing.xl,
    paddingTop: 12,
    maxHeight: "90%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppTheme.colors.border,
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: AppTheme.colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  safariHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: 16,
  },
  safariIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  safariHeaderTextWrap: {
    flex: 1,
  },
  safariHeaderTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: AppTheme.colors.dark,
  },
  safariHeaderDesc: {
    fontSize: 11,
    color: AppTheme.colors.gray,
    marginTop: 1,
    lineHeight: 15,
  },
  stepContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: AppTheme.colors.dark,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: AppTheme.colors.dark,
    marginBottom: 8,
  },
  stepImage: {
    width: "100%",
    height: "auto",
    borderRadius: AppTheme.borderRadius.lg,
    backgroundColor: AppTheme.colors.surface,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 13,
    color: AppTheme.colors.gray,
    lineHeight: 18,
    marginBottom: 6,
  },
  variantRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  variantText: {
    fontSize: 12,
    color: AppTheme.colors.gray,
    lineHeight: 16,
    flex: 1,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 12,
  },
  doneBtn: {
    marginTop: 12,
    backgroundColor: AppTheme.colors.accent,
    paddingVertical: 14,
    borderRadius: AppTheme.borderRadius.lg,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: AppTheme.colors.dark,
  },
  scroll: {
    paddingBottom: 36,
  },
  stepImageFallback: {
    width: "100%",
    height: "auto",
    borderRadius: AppTheme.borderRadius.lg,
    backgroundColor: AppTheme.colors.surface,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  variantImageWrap: {
    marginTop: 8,
    paddingLeft: 0,
  },
  variantImage: {
    width: "100%",
    height: "auto",
    borderRadius: AppTheme.borderRadius.lg,
    backgroundColor: AppTheme.colors.surface,
  },
  successSection: {
    alignItems: "center",
    gap: 10,
  },
  successImage: {
    width: "100%",
    height: "auto",
    borderRadius: AppTheme.borderRadius.lg,
  },
  successText: {
    fontSize: 13,
    color: AppTheme.colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },
});
