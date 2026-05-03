import { InviteRow } from "@/src/components/InviteRow";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { barbersService } from "../services";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { validateEmail, validatePhoneNumber } from "../utils/form-validators";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

export function CreateBarbershopInviteBarberFilledScreen() {
  const router = useRouter();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [barber, setBarber] = useState("");
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const invitedBarbers = formData.barberInvites || [];

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

  const handleAddBarber = async () => {
    const parsed = parseBarberInput(barber);
    if (!parsed) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid email or phone number"
      );
      return;
    }

    const isDuplicate = invitedBarbers.some(
      (invite) =>
        invite.email === parsed.email || invite.phone === parsed.phone
    );

    if (isDuplicate) {
      Alert.alert("Duplicate", "This barber is already in the invite list");
      return;
    }

    try {
      await barbersService.inviteSingle(parsed);
      const newInvites = [...invitedBarbers, parsed];
      updateFormData({ barberInvites: newInvites });
      setBarber("");
    } catch (error) {
      console.error("Error inviting barber:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to invite barber"
      );
    }
  };

  const handleRemoveBarber = async (email?: string, phone?: string) => {
    const key = email || phone;
    if (!key) return;

    setIsRemoving(key);
    try {
      const newInvites = invitedBarbers.filter(
        (invite) => invite.email !== email && invite.phone !== phone
      );
      updateFormData({ barberInvites: newInvites });
    } catch (error) {
      console.error("Error removing barber:", error);
      Alert.alert("Error", "Failed to remove barber from list");
    } finally {
      setIsRemoving(null);
    }
  };

  const handleContinue = () => {
    router.push("/create-barbershop-success");
  };

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={2} style={styles.wizard} />
      <Text style={styles.title}>Invite Barber</Text>
      <Text style={styles.subtitle}>Inviting barber to your barbershop</Text>

      {invitedBarbers.length > 0 && (
        <>
          <Text style={styles.barbersLabel}>{"Invited Barbers"}</Text>
          {invitedBarbers.map((barberInvite, index) => (
            <InviteRow
              key={index}
              email={barberInvite.email || barberInvite.phone || ""}
              onRemove={() =>
                handleRemoveBarber(barberInvite.email, barberInvite.phone)
              }
              style={index > 0 ? styles.inviteRowTop : undefined}
            />
          ))}
        </>
      )}

      <TextInputField
        label="Add More Barbers"
        placeholder="email / phone number"
        value={barber}
        onChangeText={setBarber}
        style={invitedBarbers.length > 0 ? styles.inputTop : undefined}
        keyboardType="email-address"
      />
      <SecondaryButton
        label="Invite"
        style={styles.inviteBtn}
        onPress={handleAddBarber}
      />

      <View style={styles.flex} />
      <PrimaryButton
        label="Finish Setup"
        onPress={handleContinue}
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
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    marginBottom: 24,
  },
  barbersLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  inviteRowTop: {
    marginTop: 8,
  },
  inputTop: {
    marginTop: 16,
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
