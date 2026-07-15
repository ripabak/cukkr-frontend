import { Colors } from "@/src/theme/colors";
import AppTheme from "@/src/app-theme";
import { HelperCopy } from "@/src/components/HelperCopy";
import { IconActionButton } from "@/src/features/barbershop/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { TextInputField } from "@/src/components/TextInputField";
import { useInviteBarber } from "@/src/features/barbershop/hooks";
import { validateEmail } from "@/src/features/barbershop/utils/form-validators";
import { useMemberRole } from "@/src/hooks";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

export function InviteBarberScreen() {
  const router = useRouter();
  const toast = useToast();
  const { role } = useMemberRole();
  const canInvite = role === "owner" || role === "admin";
  const [contact, setContact] = useState("");
  const { mutate: invite, isPending } = useInviteBarber();

  const handleSend = () => {
    const email = contact.trim();
    const validation = validateEmail(email);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    invite(email, {
      onSuccess: () => {
        toast.success("Invitation sent");
        router.back();
      },
      onError: (e) => {
        toast.error(e.message || "Failed to send invitation");
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader
          title="Invite Barber"
          onBack={() => router.back()}
          rightAction={
            canInvite ? (
              <IconActionButton
                iconName="paper-plane-outline"
                onPress={isPending ? undefined : handleSend}
                size={36}
              />
            ) : undefined
          }
        />

        <View style={styles.content}>
          <TextInputField
            label="Email"
            placeholder="Enter barber email address"
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
            editable={canInvite}
          />
          <HelperCopy
            lines={[
              "Enter the email address of the barber you want to invite.",
              "They will receive an invitation to join your barbershop.",
            ]}
          />
          {!canInvite && (
            <View style={styles.viewOnlyBanner}>
              <AppText style={styles.viewOnlyText}>Only the barbershop owner or admin can invite barbers</AppText>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    paddingTop: AppTheme.spacing.lg,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  viewOnlyBanner: {
    marginTop: 24,
    padding: 12,
    backgroundColor: Colors.bg.surface,
    borderRadius: 8,
    alignItems: "center",
  },
  viewOnlyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
});
