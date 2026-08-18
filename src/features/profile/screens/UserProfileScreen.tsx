import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { LanguageSwitcher } from "@/src/components/LanguageSwitcher";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useSignOut } from "@/src/features/auth/hooks";
import { LogoutRow } from "@/src/features/profile/components/LogoutRow";
import { ProfileSummaryCard } from "@/src/features/profile/components/ProfileSummaryCard";
import { useToast } from "@/src/lib/providers/toast";
import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
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

export function UserProfileScreen({ hideBack = false }: Props = {}) {
  const { t } = useI18nContext();
  const router = useRouter();
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
        backgroundColor={Colors.bg.default}
        contentStyle={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.text.primary} />
      </ScreenShell>
    );
  }

  if (error || !profile) {
    return (
      <ScreenShell backgroundColor={Colors.bg.default}>
        <AppText style={styles.errorText}>{t("profile.loadFailed")}</AppText>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <ScreenHeader
          title={t("profile.title")}
          onBack={hideBack ? undefined : () => router.back()}
        />
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 20, gap: 12 }}
    >
      <View style={styles.avatarWrapper}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={isUploadingAvatar ? undefined : handleAvatarUpload}
          style={[styles.avatarBox, Neu.raised(Colors.bg.surface)]}
        >
          {profile.avatarMed ? (
            <Image
              source={{ uri: profile.avatarMed }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera-outline" size={24} color={Colors.icon.muted} />
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 8,
    position: "relative",
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
    backgroundColor: Colors.brand.primarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  card: {
    marginTop: -4,
  },
  errorText: {
    fontSize: 16,
    color: Colors.status.danger,
    textAlign: "center",
  },
});
