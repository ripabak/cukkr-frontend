import { AlertModal } from "@/src/components/AlertModal";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { LogoutRow } from "@/src/components/LogoutRow";
import { ProfileSummaryCard } from "@/src/components/ProfileSummaryCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- MOCK DATA ---
const MOCK_USER_NAME = "Pepe Julian";
const MOCK_USER_BIO = "Fade Specialist";
const MOCK_USER_EMAIL = "julianpepe@gmail.com";
const MOCK_USER_PHONE = "+62838383833";

export function UserProfileScreen() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showContactChanged, setShowContactChanged] = useState(false);

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
          value={MOCK_USER_NAME}
          onPress={() => router.push("/edit-user-profile-fields" as any)}
        />
        <InfoRow
          label="Bio"
          value={MOCK_USER_BIO}
          isLast
          onPress={() => router.push("/edit-user-profile-fields" as any)}
        />
      </ProfileSummaryCard>

      <Text style={styles.sectionLabel}>Account</Text>
      <ProfileSummaryCard style={styles.card}>
        <InfoRow
          label="Email"
          value={MOCK_USER_EMAIL}
          onPress={() => router.push("/verify-contact" as any)}
        />
        <InfoRow
          label="Phone Number"
          value={MOCK_USER_PHONE}
          onPress={() => router.push("/verify-contact" as any)}
        />
        <InfoRow
          label="Change Password"
          showChevron
          onPress={() => router.push("/edit-user-profile-fields" as any)}
          isLast
        />
      </ProfileSummaryCard>

      <Text style={styles.sectionLabel}>Logout</Text>
      <LogoutRow onPress={() => setShowLogoutConfirm(true)} />
      <ConfirmationModal
        visible={showLogoutConfirm}
        title="Confirm Log out?"
        description="You will be signed out of your account."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        onConfirm={() => setShowLogoutConfirm(false)}
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
});
