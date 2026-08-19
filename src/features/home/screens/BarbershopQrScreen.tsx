import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useCurrentBarbershop } from "@/src/features/home/hooks";
import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Image, Platform, Share, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import { formatDateTime } from "@/src/utils/date";
import { useToast } from "@/src/lib/providers";

export function BarbershopQrScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const toast = useToast();
  const { data: barbershop } = useCurrentBarbershop();
  const bannerRef = useRef<View>(null);

  const baseUrl = barbershop?.slug
    ? `${(process.env.EXPO_PUBLIC_WEB_URL || "https://cukkr.com").replace(/\/$/, "")}/${barbershop.slug}`
    : null;

  const handleCapture = async () => {
    if (!bannerRef.current) return;
    try {
      const uri = await captureRef(bannerRef, {
        format: "png",
        quality: 1,
        result: Platform.OS === "web" ? "data-uri" : "tmpfile",
        width: 1200,
      });
      if (Platform.OS === "web") {
        const blob = await (await fetch(uri)).blob();
        const file = new File([blob], "cukkr-qr.png", { type: "image/png" });
        await navigator.share({ files: [file] });
      } else {
        await Share.share({ url: uri });
      }
    } catch (error) {
      const e = error as { message?: string; name?: string };
      if (
        e?.name !== "AbortError" &&
        e?.message !== "User did not share"
      ) {
        toast.error(t("barbershopQr.captureFailed"));
      }
    }
  };

  const now = new Date();

  return (
    <ScreenShell
      contentStyle={styles.content}
      headerSlot={
        <ScreenHeader
          title={t("barbershopQr.title")}
          onBack={() => router.back()}
        />
      }
    >
      <View ref={bannerRef} style={[styles.banner, Neu.raised(colors.bg.default, 1.3)]} collapsable={false}>
        <View style={styles.headerRow}>
          <View style={styles.qrBrand}>
            <AppText style={styles.qrBrandText}>QR</AppText>
          </View>
          <View style={styles.descriptionCol}>
            <AppText style={styles.descriptionLine}>
              {t("barbershopQr.descriptionLine1")}
            </AppText>
            <AppText style={styles.descriptionLine}>
              {t("barbershopQr.descriptionLine2")}
            </AppText>
          </View>
          <Image
            source={require("@/public/cukkr-logo-trans.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>

        {barbershop?.name ? (
          <AppText style={styles.shopName} numberOfLines={2}>
            {barbershop.name}
          </AppText>
        ) : null}

        {baseUrl ? (
          <AppText style={styles.shopLink} numberOfLines={1}>
            {baseUrl}
          </AppText>
        ) : null}

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <View style={styles.accentTopLeftH} />
            <View style={styles.accentTopLeftV} />
            <View style={styles.accentBottomRightH} />
            <View style={styles.accentBottomRightV} />
            {baseUrl ? (
              <QRCode
                value={baseUrl}
                size={200}
                backgroundColor={colors.bg.default}
                color={colors.text.primary}
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <AppText style={styles.placeholderText}>
                  {t("common.noData")}
                </AppText>
              </View>
            )}
          </View>
        </View>

        <AppText style={styles.printedOn}>
          {t("barbershopQr.printedOn")} {formatDateTime(now)}
        </AppText>
      </View>

      <PrimaryButton
        label={t("barbershopQr.shareQr")}
        onPress={handleCapture}
        disabled={!baseUrl}
      />
    </ScreenShell>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  content: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  banner: {
    width: "100%",
    borderRadius: 20,
    overflow: "visible",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 28,
    position: "relative",
  },
  accentTopLeftH: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 36,
    height: 4,
    backgroundColor: c.brand.primary,
  },
  accentTopLeftV: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 4,
    height: 36,
    backgroundColor: c.brand.primary,
  },
  accentBottomRightH: {
    position: "absolute",
    bottom: -12,
    right: -12,
    width: 36,
    height: 4,
    backgroundColor: c.brand.primary,
  },
  accentBottomRightV: {
    position: "absolute",
    bottom: -12,
    right: -12,
    width: 4,
    height: 36,
    backgroundColor: c.brand.primary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  qrBrand: {
    marginRight: 14,
  },
  qrBrandText: {
    fontSize: 28,
    fontWeight: "700",
    color: c.text.primary,
    lineHeight: 32,
    letterSpacing: 1,
  },
  descriptionCol: {
    flex: 1,
    justifyContent: "center",
    marginRight: 12,
  },
  descriptionLine: {
    fontSize: 13,
    color: c.text.secondary,
    lineHeight: 18,
    fontWeight: "500",
  },
  brandLogo: {
    width: 44,
    height: 44,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: c.text.primary,
    textAlign: "center",
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  shopLink: {
    fontSize: 12,
    color: c.text.muted,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
    fontWeight: "400",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  qrWrapper: {
    position: "relative",
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: c.text.muted,
    textAlign: "center",
  },
  printedOn: {
    fontSize: 11,
    color: c.text.muted,
    textAlign: "center",
    fontWeight: "400",
  },

  });
