import { useImagePicker } from "@/src/hooks";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { authClient } from "@/src/lib/auth-client";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { validateBarbershopName } from "../utils/form-validators";

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const toast = useToast();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [name, setName] = useState(formData.name || "");
  const [logoPreviewUri, setLogoPreviewUri] = useState<string | undefined>(
    undefined,
  );
  const { data: session } = authClient.useSession();
  const { pickAndGetFile, isPicking } = useImagePicker();

  const hasActiveOrg = !!session?.session?.activeOrganizationId;

  const validation = validateBarbershopName(name);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handleCreate = () => {
    if (!validation.isValid) return;

    updateFormData({ name });
    router.push("/d/create-barbershop-first-service");
  };

  const handleCancel = () => {
    router.back();
  };

  const isValid = validation.isValid;

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={2} currentStep={0} style={styles.wizard} />
      <AppText style={styles.title}>{t("createBarbershop.title")}</AppText>
      <AppText style={styles.subtitle}>{t("createBarbershop.subtitle")}</AppText>

      <TextInputField
        label={t("createBarbershop.nameLabel")}
        placeholder={t("createBarbershop.namePlaceholder")}
        value={name}
        onChangeText={handleNameChange}
      />

      <AppText style={styles.logoLabel}>{t("barbershop.logoUpload")}</AppText>
      <ImageUploadBox
        label={t("createBarbershop.chooseImage")}
        imageUri={logoPreviewUri}
        style={styles.imageUpload}
        onPress={async () => {
          const file = await pickAndGetFile();
          if (!file) return;
          setLogoPreviewUri(file.uri);
          updateFormData({ logo: file as unknown as File });
        }}
      />

      <View style={styles.flex} />
      {hasActiveOrg ? (
        <View style={styles.buttonRow}>
          <SecondaryButton
            label={t("common.cancel")}
            onPress={handleCancel}
            color={Colors.status.danger}
            style={styles.cancelButton}
          />
          <PrimaryButton
            label={t("common.next")}
            style={styles.nextButton}
            onPress={handleCreate}
            disabled={!isValid}
          />
        </View>
      ) : (
        <PrimaryButton
          label={t("common.next")}
          style={styles.button}
          onPress={handleCreate}
          disabled={!isValid}
        />
      )}
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
  logoLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
    marginTop: 16,
  },
  imageUpload: {
    marginTop: 0,
  },
  flex: {
    flex: 1,
    minHeight: 32,
  },
  button: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    width: undefined,
  },
  nextButton: {
    flex: 3,
  },
});
