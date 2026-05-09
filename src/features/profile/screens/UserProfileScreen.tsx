import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useSignOut } from "@/src/features/auth/hooks";
import { AlertModal } from "@/src/features/profile/components/AlertModal";
import { LogoutRow } from "@/src/features/profile/components/LogoutRow";
import { ProfileSummaryCard } from "@/src/features/profile/components/ProfileSummaryCard";
import { useToast } from "@/src/lib/providers/toast";
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
        backgroundColor="#F5F4E8"
        contentStyle={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#1A1A1A" />
      </ScreenShell>
    );
  }

  if (error || !profile) {
    return (
      <ScreenShell backgroundColor="#F5F4E8">
        <Text style={styles.errorText}>Failed to load profile</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader title="User Profile" onBack={() => router.back()} />
      }
      backgroundColor="#F5F4E8"
      contentStyle={{ paddingTop: 20, gap: 12 }}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#666" />
        </View>
        <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={14} color="#1A1A1A" />
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
    borderRadius: 12,
    backgroundColor: "#D0CCC0",
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0DDD0",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  card: {
    marginTop: -4,
  },
  errorText: {
    fontSize: 16,
    color: "#EE6352",
    textAlign: "center",
  },
});
