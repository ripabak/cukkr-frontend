import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useSignOut } from "@/src/features/auth/hooks";
import { AlertModal } from "@/src/features/profile/components/AlertModal";
import { LogoutRow } from "@/src/features/profile/components/LogoutRow";
import { ProfileSummaryCard } from "@/src/features/profile/components/ProfileSummaryCard";
import { useToast } from "@/src/lib/providers/toast";
import { Colors } from '@/src/theme/colors';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useProfile } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

export function UserProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showContactChanged, setShowContactChanged] = useState(false);
  const { data: profile, isLoading, error } = useProfile();
  const { mutateAsync: signOut, isPending: signingOut } = useSignOut();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
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
        <Text style={styles.errorText}>Failed to load profile</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader title="User Profile" onBack={() => router.back()} />
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 20, gap: 12 }}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>
            {profile.name
              ? profile.name.split(" ").slice(0, 2).map((w: string) => w[0].toUpperCase()).join("")
              : "?"}
          </Text>
        </View>
        <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={14} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>General Information</Text>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow
          label="Your Name"
          value={profile.name}
          onPress={() => router.push({ pathname: "/edit-user-profile-fields", params: { mode: "name" } })}
        />
        <InfoRow
          label="Bio"
          value={profile.bio || "Add a bio"}
          isLast
          onPress={() => router.push({ pathname: "/edit-user-profile-fields", params: { mode: "bio" } })}
        />
      </ProfileSummaryCard>

      <Text style={styles.sectionLabel}>Account</Text>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow
          label="Email"
          value={profile.email}
        />
        <InfoRow
          label="Phone Number"
          value={profile.phone || "Add phone number"}
        />
        <InfoRow
          label="Change Password"
          showChevron
          onPress={() => router.push({ pathname: "/edit-user-profile-fields", params: { mode: "password" } })}
          isLast
        />
      </ProfileSummaryCard>

      <Text style={styles.sectionLabel}>Logout</Text>
      <LogoutRow onPress={() => setShowLogoutConfirm(true)} />
      <ConfirmationModal
        visible={showLogoutConfirm}
        title="Confirm Log out?"
        description="You will be signed out of your account."
        confirmLabel={signingOut ? "Logging out..." : "Log Out"}
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <AlertModal
        visible={showContactChanged}
        title="Contact Changed"
        description="Your contact has been changed successfully."
        actionLabel="OK"
        onAction={() => setShowContactChanged(false)}
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
