import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { LanguageSwitcher } from "@/src/components/LanguageSwitcher";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { ThemePickerSheet } from "@/src/components/ThemePickerSheet";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useSignOut } from "@/src/features/auth/hooks";
import { LogoutRow } from "@/src/features/profile/components/LogoutRow";
import { ProfileSummaryCard } from "@/src/features/profile/components/ProfileSummaryCard";
import { useToast } from "@/src/lib/providers/toast";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import { Skeleton } from "@/src/components/Skeleton";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile, useUploadAvatar } from "../hooks";
import { useSubscription } from "@/src/features/billing/hooks";
import { useImagePicker } from "@/src/hooks";
import { getErrorMessage } from "../utils/error-handler";

interface Props {
  hideBack?: boolean;
}

/** Skeleton for a single profile info row — mirrors InfoRow's label/value layout. */
function SkeletonInfoRow({ isLast = false }: { isLast?: boolean }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={[
        styles.skRow,
        isLast ? null : styles.skRowBorder,
      ]}
    >
      <Skeleton width="30%" height={12} radius={6} />
      <View style={styles.skRowValue}>
        <Skeleton width="48%" height={14} radius={6} />
      </View>
    </View>
  );
}

export function UserProfileScreen({ hideBack = false }: Props = {}) {
  const { t } = useI18nContext();
  const router = useRouter();
  const toast = useToast();
  const { colors, mode } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { data: profile, isLoading, error } = useProfile();
  const { data: subscription } = useSubscription();
  const { mutateAsync: signOut, isPending: signingOut } = useSignOut();
  const { pickAndGetFile } = useImagePicker();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatar();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/d/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handleAvatarUpload = async () => {
    const file = await pickAndGetFile();
    if (!file) return;

    uploadAvatar(file, {
      onSuccess: () => {
        toast.success(t("toast.avatarUploadSuccess"));
      },
      onError: (e) => {
        const message = e.message;
        if (message.startsWith("MAX_SIZE_EXCEEDED:")) {
          const size = message.split(":")[1];
          toast.error(t("toast.imageTooLarge", { size }));
        } else {
          toast.error(e.message || t("toast.unknownError"));
        }
      },
    });
  };

  if (isLoading) {
    return (
      <ScreenShell
        headerSlot={
          <ScreenHeader
            title={t("profile.title")}
            onBack={hideBack ? undefined : () => router.back()}
          />
        }
        backgroundColor={colors.bg.default}
        contentStyle={{ paddingTop: 20, gap: 12 }}
      >
        <View style={styles.avatarWrapper}>
          <Skeleton.Circle size={96} />
        </View>
        <Skeleton width="34%" height={13} radius={7} style={styles.skLabel} />
        <ProfileSummaryCard style={styles.card}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonInfoRow key={i} isLast={i === 3} />
          ))}
        </ProfileSummaryCard>
        <Skeleton width="34%" height={13} radius={7} style={styles.skLabel} />
        <ProfileSummaryCard style={styles.card}>
          {[0, 1].map((i) => (
            <SkeletonInfoRow key={i} isLast={i === 1} />
          ))}
        </ProfileSummaryCard>
      </ScreenShell>
    );
  }

  if (error || !profile) {
    return (
      <ScreenShell backgroundColor={colors.bg.default}>
        <AppText style={styles.errorText}>{t("profile.loadFailed")}</AppText>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader
          title={t("profile.title")}
          onBack={hideBack ? undefined : () => router.back()}
        />
      }
      backgroundColor={colors.bg.default}
      contentStyle={{ paddingTop: 20, gap: 12 }}
    >
      <View style={styles.avatarWrapper}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={isUploadingAvatar ? undefined : handleAvatarUpload}
          style={[styles.avatarBox, Neu.raised(colors.bg.surface)]}
        >
          {profile.avatarMed ? (
            <Image
              source={{ uri: profile.avatarMed }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera-outline" size={24} color={colors.icon.muted} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <AppText style={styles.sectionLabel}>{t("profile.generalInfo")}</AppText>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow
          label={t("profile.yourName")}
          value={profile.name}
          onPress={() =>
            router.push({
              pathname: "/d/edit-user-profile-fields",
              params: { mode: "name" },
            })
          }
        />
        <InfoRow
          label={t("profile.bio")}
          value={profile.bio || t("profile.addBio")}
          isLast
          onPress={() =>
            router.push({
              pathname: "/d/edit-user-profile-fields",
              params: { mode: "bio" },
            })
          }
        />
      </ProfileSummaryCard>

      <AppText style={styles.sectionLabel}>{t("profile.account")}</AppText>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow label={t("profile.email")} value={profile.email} />
        <InfoRow
          label={t("profile.changePassword")}
          showChevron
          onPress={() =>
            router.push({
              pathname: "/d/edit-user-profile-fields",
              params: { mode: "password" },
            })
          }
          isLast
        />
      </ProfileSummaryCard>

      <AppText style={styles.sectionLabel}>{t("profile.subscription")}</AppText>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow
          label={t("profile.plan")}
          value={subscription?.plan?.name ?? "Free"}
          showChevron
          onPress={() => router.push("/d/billing")}
          isLast
        />
      </ProfileSummaryCard>

      <AppText style={styles.sectionLabel}>{t("profile.language")}</AppText>
      <ProfileSummaryCard style={styles.card}>
        <LanguageSwitcher />
      </ProfileSummaryCard>

      <AppText style={styles.sectionLabel}>{t("profile.appearance")}</AppText>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow
          label={t("profile.themeMode")}
          value={
            mode === "light"
              ? t("profile.themeLight")
              : mode === "dark"
                ? t("profile.themeDark")
                : t("profile.themeSystem")
          }
          showChevron
          onPress={() => setShowThemePicker(true)}
          isLast
        />
      </ProfileSummaryCard>

      <AppText style={styles.sectionLabel}>{t("profile.logout")}</AppText>
      <LogoutRow onPress={() => setShowLogoutConfirm(true)} />
      <ConfirmationModal
        visible={showLogoutConfirm}
        title={t("profile.confirmLogout")}
        description={t("profile.confirmLogoutDesc")}
        confirmLabel={signingOut ? t("profile.loggingOut") : t("profile.logout")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <ThemePickerSheet
        visible={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />
    </ScreenShell>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    avatarWrapper: {
      alignSelf: "center",
      marginBottom: 8,
      position: "relative",
    },
    skLabel: {
      marginTop: 8,
      marginBottom: 4,
    },
    skRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    skRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border.light,
    },
    skRowValue: {
      flex: 1,
      alignItems: "flex-end",
    },
    avatarBox: {
      width: 96,
      height: 96,
      borderRadius: 28,
      padding: 5,
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 22,
    },
    avatarPlaceholder: {
      width: "100%",
      height: "100%",
      borderRadius: 22,
      backgroundColor: c.brand.primarySurface,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: c.text.secondary,
      marginTop: 4,
      letterSpacing: 0.5,
    },
    card: {
      marginTop: -4,
    },
    errorText: {
      fontSize: 16,
      color: c.status.danger,
      textAlign: "center",
    },
  });
