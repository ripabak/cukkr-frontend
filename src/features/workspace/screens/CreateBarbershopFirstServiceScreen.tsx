import { MultilineInputField } from "@/src/components/MultilineInputField";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useToast } from "@/src/lib/providers";
import { servicesService, organizationService } from "../services";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { validateServiceName, validatePrice, validateDuration } from "../utils/form-validators";
import { getErrorMessage } from "../utils/error-handler";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function CreateBarbershopFirstServiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [serviceName, setServiceName] = useState(formData.serviceName || "");
  const [description, setDescription] = useState(formData.description || "");
  const [price, setPrice] = useState(formData.servicePrice?.toString() || "");
  const [duration, setDuration] = useState(formData.serviceDuration?.toString() || "");
  const [isCreating, setIsCreating] = useState(false);

  const handleFinish = async () => {
    const nameValidation = validateServiceName(serviceName);
    if (!nameValidation.isValid) {
      toast.error(nameValidation.message);
      return;
    }

    const priceNum = parseInt(price, 10);
    const priceValidation = validatePrice(priceNum);
    if (!priceValidation.isValid) {
      toast.error(priceValidation.message);
      return;
    }

    const durationNum = parseInt(duration, 10);
    const durationValidation = validateDuration(durationNum);
    if (!durationValidation.isValid) {
      toast.error(durationValidation.message);
      return;
    }

    setIsCreating(true);

    try {
      // Step 1: Create organization (barbershop)
      const org = await organizationService.create({
        name: formData.name!,
        slug: formData.slug!,
        metadata: {
          description: formData.description,
          address: formData.address,
        },
      });

      // Step 2: Set organization as active
      await organizationService.setActive(org.id);

      // Step 3: Create service in the organization
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

      router.push("/create-barbershop-invite-barber-empty");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  const isValid =
    validateServiceName(serviceName).isValid &&
    validatePrice(parseInt(price, 10)).isValid &&
    validateDuration(parseInt(duration, 10)).isValid;

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={1} style={styles.wizard} />
      <Text style={styles.title}>Create Your First Service</Text>
      <Text style={styles.subtitle}>
        This will be the default service for your barbershop. You can change it
        anytime.
      </Text>
      <TextInputField
        label="Name"
        placeholder="Service Name"
        value={serviceName}
        onChangeText={setServiceName}
      />
      <MultilineInputField
        label="Description (Optional)"
        placeholder="Service Description"
        value={description}
        onChangeText={setDescription}
        style={styles.descInput}
      />
      <Text style={styles.fieldLabel}>Price</Text>
      <PrefixedInputField
        prefix="Rp"
        value={price}
        onChangeText={setPrice}
      />
      <Text style={[styles.fieldLabel, styles.fieldLabelTop]}>Duration</Text>
      <PrefixedInputField
        prefix="Minutes"
        value={duration}
        onChangeText={setDuration}
      />
      <View style={styles.flex} />
      <PrimaryButton
        label="Finish Setup"
        style={styles.button}
        onPress={handleFinish}
        disabled={!isValid || isCreating}
      />
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
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 13,
    color: "#666666",
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  descInput: {
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 6,
    marginTop: 16,
  },
  fieldLabelTop: {
    marginTop: 16,
  },
  flex: {
    flex: 1,
    minHeight: 32,
  },
  button: {
    marginBottom: 16,
  },
});
