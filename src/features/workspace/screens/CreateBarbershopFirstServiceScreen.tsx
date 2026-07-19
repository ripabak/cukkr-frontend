import { Colors } from "@/src/theme/colors";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { LabeledInput } from "@/src/components/LabeledInput";
import { PriceInput } from "@/src/components/PriceInput";
import { BackButton } from "@/src/components/BackButton";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { useCreateOrganization, useSetActiveOrganization } from "../hooks";
import { servicesService } from "../services";
import { getErrorMessage } from "../utils/error-handler";
import {
  validateDuration,
  validatePrice,
  validateServiceName,
} from "../utils/form-validators";
import { generateSlug } from "../utils/slug-generator";

export function CreateBarbershopFirstServiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [serviceName, setServiceName] = useState(formData.serviceName || "");
  const [description, setDescription] = useState(formData.description || "");
  const [price, setPrice] = useState(formData.servicePrice?.toString() || "");
  const [duration, setDuration] = useState(
    formData.serviceDuration?.toString() || "",
  );
  const { mutate: createOrg, isPending: isCreatingOrg } =
    useCreateOrganization();
  const { mutate: setActive, isPending: isSettingActive } =
    useSetActiveOrganization();

  const handleFinish = () => {
    const nameValidation = validateServiceName(serviceName);
    if (!nameValidation.isValid) {
      toast.error(t(nameValidation.message));
      return;
    }

    const priceNum = parseInt(price, 10);
    const priceValidation = validatePrice(priceNum);
    if (!priceValidation.isValid) {
      toast.error(t(priceValidation.message));
      return;
    }

    const durationNum = parseInt(duration, 10);
    const durationValidation = validateDuration(durationNum);
    if (!durationValidation.isValid) {
      toast.error(t(durationValidation.message));
      return;
    }

    // Step 1: Create organization (barbershop)
    createOrg(
      {
        name: formData.name!,
        slug: generateSlug(formData.name!),
        metadata: {
          description: formData.description,
          address: formData.address,
        },
      },
      {
        onSuccess: async (org) => {
          // Step 2: Set organization as active
          setActive(org.id, {
            onSuccess: async () => {
              // Step 3: Create service in the organization
              try {
                const serviceResponse = await servicesService.create({
                  name: serviceName,
                  price: priceNum,
                  duration: durationNum,
                  description: description || null,
                });

                updateFormData({
                  serviceName,
                  servicePrice: priceNum,
                  serviceDuration: durationNum,
                  serviceId: serviceResponse?.id,
                });

                router.back();
                router.replace("/d/create-barbershop-open-hours");
              } catch (error) {
                console.log(error);
                toast.error(getErrorMessage(error));
              }
            },
            onError: (error) => {
              toast.error(t("createBarbershop.failedSetActiveOrg") + ": " + error.message);
            },
          });
        },
        onError: (error) => {
          toast.error(t("createBarbershop.failedCreateOrg") + ": " + error.message);
        },
      },
    );
  };

  const isValid =
    validateServiceName(serviceName).isValid &&
    validatePrice(parseInt(price, 10)).isValid &&
    validateDuration(parseInt(duration, 10)).isValid;

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={2} currentStep={1} style={styles.wizard} />
      <AppText style={styles.title}>{t("services.addService")}</AppText>
      <AppText style={styles.subtitle}>
        {t("createBarbershop.firstServiceSubtitle")}
      </AppText>
      <TextInputField
        label={t("services.serviceName")}
        placeholder={t("services.namePlaceholder")}
        value={serviceName}
        onChangeText={setServiceName}
      />
      <MultilineInputField
        label={t("createBarbershop.descriptionLabel")}
        placeholder={t("createBarbershop.descriptionPlaceholder")}
        value={description}
        onChangeText={setDescription}
        style={styles.descInput}
      />
      <PriceInput
        value={price}
        onChangeText={setPrice}
        style={styles.fieldSpacing}
      />
      <LabeledInput
        label={t("services.duration")}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.fieldSpacing}
      />
      <View style={styles.flex} />
      <View style={styles.buttonRow}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.primaryButtonWrapper}>
          <PrimaryButton
            label={
              isCreatingOrg || isSettingActive ? t("common.saving") : t("common.save")
            }
            onPress={handleFinish}
            disabled={!isValid || isCreatingOrg || isSettingActive}
          />
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
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  descInput: {
    marginTop: 16,
  },
  fieldSpacing: {
    marginTop: 16,
  },
  flex: {
    flex: 1,
    minHeight: 32,
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
