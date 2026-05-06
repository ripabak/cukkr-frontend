import { HelperCopy } from "@/src/components/HelperCopy";
import { IconActionButton } from "@/src/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { TextInputField } from "@/src/components/TextInputField";
import { useInviteBarber } from "@/src/features/barbershop/hooks";
import { validateEmail } from "@/src/features/barbershop/utils/form-validators";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function InviteBarberScreen() {
  const router = useRouter();
  const toast = useToast();
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
            <IconActionButton
              iconName="paper-plane-outline"
              onPress={isPending ? undefined : handleSend}
              size={36}
            />
          }
        />

        <View style={styles.content}>
          <TextInputField
            label="Email"
            placeholder="Enter barber email address"
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
          />
          <HelperCopy
            lines={[
              "Enter the email address of the barber you want to invite.",
              "They will receive an invitation to join your barbershop.",
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEEEE0",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
