import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useCurrentBarbershop, useCurrentPin } from "@/src/features/home/hooks";
import { Colors } from "@/src/theme/colors";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React from "react";
import { Share, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import QRCode from "react-native-qrcode-svg";

export function WalkInQrScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { data: barbershop } = useCurrentBarbershop();
  const { data: pinData } = useCurrentPin();

  const baseUrl = barbershop?.slug
    ? `${(process.env.EXPO_PUBLIC_WEB_URL ?? "").replace(/\/$/, "")}/${barbershop.slug}`
    : null;

  const qrUrl = baseUrl
    ? pinData?.pin
      ? `${baseUrl}?pin=${pinData.pin}`
      : baseUrl
    : null;

  const handleShare = async () => {
    if (!qrUrl) return;
    await Share.share({ message: qrUrl });
  };

  return (
    <ScreenShell
      contentStyle={styles.content}
      headerSlot={
        <ScreenHeader title={t("home.walkIn")} onBack={() => router.back()} />
      }
    >
      <View style={styles.card}>
        {qrUrl ? (
          <QRCode
            value={qrUrl}
            size={220}
            backgroundColor={Colors.bg.surface}
            color={Colors.text.primary}
          />
        ) : (
          <View style={styles.qrPlaceholder}>
            <AppText style={styles.placeholderText}>
              {t("common.noData")}
            </AppText>
          </View>
        )}
      </View>

      {pinData?.pin ? (
        <View style={styles.pinRow}>
          <AppText style={styles.pinLabel}>PIN</AppText>
          <AppText style={styles.pinValue}>{pinData.pin}</AppText>
        </View>
      ) : null}

      <AppText style={styles.hint}>
        {t("walkIn.hint")}
      </AppText>

      <PrimaryButton
        label={t("walkIn.share")}
        onPress={handleShare}
        disabled={!qrUrl}
        style={styles.shareBtn}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 24,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: "center",
  },
  pinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.bg.surface,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 20,
  },
  pinLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  pinValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: 6,
  },
  hint: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  shareBtn: {
    alignSelf: "stretch",
  },
});
