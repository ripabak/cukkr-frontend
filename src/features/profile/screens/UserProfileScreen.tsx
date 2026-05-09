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
import { Text, TouchableOpacity, View } from "react-native";

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
      <View className="self-center mb-sm relative">
        <View className="w-20 h-20 rounded-md bg-[#D0CCC0] items-center justify-center">
          <Ionicons name="person" size={40} color="#666" />
        </View>
        <TouchableOpacity className="absolute -bottom-[6px] -right-[6px] w-[26px] h-[26px] rounded-full bg-card border border-border items-center justify-center" activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <Text className="text-[13px] text-[#888888] mt-xs">General Information</Text>
      <ProfileSummaryCard className="-mt-1">
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

      <Text className="text-[13px] text-[#888888] mt-xs">Account</Text>
      <ProfileSummaryCard className="-mt-1">
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

      <Text className="text-[13px] text-[#888888] mt-xs">Logout</Text>
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


