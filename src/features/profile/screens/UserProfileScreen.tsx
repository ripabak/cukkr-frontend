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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

export function UserProfileScreen() {
  const { t } = useI18nContext();
  const router = useRouter();
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { data: profile, isLoading, error } = useProfile();
  const { mutateAsync: signOut, isPending: signingOut } = useSignOut();

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
        <ScreenHeader title={t("profile.title")} onBack={() => router.back()} />
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 20, gap: 12 }}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarInitials}>
            {profile.name
              ? profile.name
                  .split(" ")
                  .slice(0, 2)
                  .filter(Boolean)
                  .map((w: string) => w[0].toUpperCase())
                  .join("")
              : "?"}
          </AppText>
        </View>
        <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
          <Ionicons
            name="camera-outline"
            size={14}
            color={Colors.text.primary}
          />
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: Colors.brand.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    color: Colors.icon.muted,
    marginTop: 4,
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
