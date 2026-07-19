import { Colors } from "@/src/theme/colors";
import { InviteRow } from "@/src/features/workspace/components/InviteRow";
import { BackButton } from "@/src/components/BackButton";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useInviteBarber } from "../hooks";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { validateEmail } from "../utils/form-validators";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { AppText } from "@/src/components/AppText";

export function CreateBarbershopInviteBarberFilledScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [barber, setBarber] = useState("");
  const { mutate: inviteBarber, isPending: isInviting } = useInviteBarber();

  const invitedBarbers = formData.barberInvites || [];

  const parseBarberInput = (
    input: string,
  ): { email?: string } | null => {
    const trimmed = input.trim();

    if (trimmed.includes("@")) {
      const emailValidation = validateEmail(trimmed);
      if (emailValidation.isValid) {
        return { email: trimmed };
      }
      return null;
    }

    return null;
  };

  const handleAddBarber = () => {
    const parsed = parseBarberInput(barber);
    if (!parsed) {
      Alert.alert(
        t("common.error"),
        t("common.error"),
      );
      return;
    }

    const isDuplicate = invitedBarbers.some(
      (invite) => invite.email === parsed.email,
    );

    if (isDuplicate) {
      Alert.alert(t("common.error"), t("common.error"));
      return;
    }

    inviteBarber(
      { email: parsed.email! },
      {
        onSuccess: () => {
          const newInvites = [...invitedBarbers, parsed];
          updateFormData({ barberInvites: newInvites });
          setBarber("");
        },
        onError: (error) => {
          Alert.alert(t("common.error"), error.message || t("common.error"));
        },
      },
    );
  };

  const handleRemoveBarber = (email?: string) => {
    if (!email) return;

    const newInvites = invitedBarbers.filter(
      (invite) => invite.email !== email,
    );
    updateFormData({ barberInvites: newInvites });
  };

  const handleContinue = () => {
    router.push("/d/create-barbershop-success");
  };

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={2} currentStep={1} style={styles.wizard} />
      <AppText style={styles.title}>{t("barbers.inviteBarber")}</AppText>
      <AppText style={styles.subtitle}>{t("barbers.inviteViaEmail")}</AppText>

      {invitedBarbers.length > 0 && (
        <>
          <AppText style={styles.barbersLabel}>{t("barbers.title")}</AppText>
          {invitedBarbers.map((barberInvite, index) => (
            <InviteRow
              key={index}
              email={barberInvite.email || ""}
              onRemove={() =>
                handleRemoveBarber(barberInvite.email)
              }
              style={index > 0 ? styles.inviteRowTop : undefined}
            />
          ))}
        </>
      )}

      <TextInputField
        label={t("barbers.addBarber")}
        placeholder={t("auth.email")}
        value={barber}
        onChangeText={setBarber}
        style={invitedBarbers.length > 0 ? styles.inputTop : undefined}
        keyboardType="email-address"
      />
      <SecondaryButton
        label={isInviting ? t("common.saving") : t("barbers.inviteBarber")}
        style={styles.inviteBtn}
        onPress={handleAddBarber}
      />

      <View style={styles.flex} />
      <View style={styles.buttonRow}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.primaryButtonWrapper}>
          <PrimaryButton label={t("common.done")} onPress={handleContinue} />
        </View>
      </View>
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
    marginBottom: 24,
  },
  barbersLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  primaryButtonWrapper: {
    flex: 1,
  },
});
