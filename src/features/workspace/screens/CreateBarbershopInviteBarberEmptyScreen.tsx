import { Colors } from '@/src/theme/colors';
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useInviteBarber } from "../hooks";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { validateEmail, validatePhoneNumber } from "../utils/form-validators";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

export function CreateBarbershopInviteBarberEmptyScreen() {
  const router = useRouter();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [barber, setBarber] = useState("");
  const { mutate: inviteBarber, isPending: isInviting } = useInviteBarber();

  const parseBarberInput = (input: string): { email?: string; phone?: string } | null => {
    const trimmed = input.trim();

    if (trimmed.includes("@")) {
      const emailValidation = validateEmail(trimmed);
      if (emailValidation.isValid) {
        return { email: trimmed };
      }
      return null;
    }

    const phoneValidation = validatePhoneNumber(trimmed);
    if (phoneValidation.isValid) {
      return { phone: trimmed };
    }

    return null;
  };

  const handleAddBarber = () => {
    const parsed = parseBarberInput(barber);
    if (!parsed) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid email or phone number"
      );
      return;
    }

    // Only email-based invitations are supported
    if (!parsed.email) {
      Alert.alert(
        "Email Required",
        "Please enter an email address for invitation"
      );
      return;
    }

    const currentInvites = formData.barberInvites || [];
    const isDuplicate = currentInvites.some(
      (invite) =>
        invite.email === parsed.email || invite.phone === parsed.phone
    );

    if (isDuplicate) {
      Alert.alert("Duplicate", "This barber is already in the invite list");
      return;
    }

    inviteBarber({ email: parsed.email }, {
      onSuccess: () => {
        const newInvites = [...currentInvites, parsed];
        updateFormData({ barberInvites: newInvites });
        setBarber("");

        if (newInvites.length > 0) {
          router.push("/d/create-barbershop-invite-barber-filled");
        }
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          error.message || "Failed to invite barber"
        );
      },
    });
  };

  const handleSkip = () => {
    updateFormData({ barberInvites: [] });
    router.push("/d/create-barbershop-success");
  };

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={2} style={styles.wizard} />
      <Text style={styles.title}>Invite Barber</Text>
      <Text style={styles.subtitle}>Inviting barber to your barbershop</Text>
      <TextInputField
        label="Add Barber"
        placeholder="email / phone number"
        value={barber}
        onChangeText={setBarber}
        keyboardType="email-address"
      />
      <SecondaryButton
        label="Invite"
        style={styles.inviteBtn}
        onPress={handleAddBarber}
      />
      <View style={styles.flex} />
      <PrimaryButton
        label="Continue"
        onPress={handleSkip}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wizard: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 32,
  },
  inviteBtn: {
    marginTop: 12,
    alignSelf: "center",
    width: "auto",
    paddingHorizontal: 32,
  },
  flex: {
    flex: 1,
  },
});
