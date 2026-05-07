import { MultilineInputField } from "@/src/components/MultilineInputField";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { useCreateOrganization, useSetActiveOrganization } from "../hooks";
import { servicesService } from "../services";
import { getErrorMessage } from "../utils/error-handler";
import { validateDuration, validatePrice, validateServiceName } from "../utils/form-validators";

export function CreateBarbershopFirstServiceScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [serviceName, setServiceName] = useState(formData.serviceName || "");
  const [description, setDescription] = useState(formData.description || "");
  const [price, setPrice] = useState(formData.servicePrice?.toString() || "");
  const [duration, setDuration] = useState(formData.serviceDuration?.toString() || "");
  const { mutate: createOrg, isPending: isCreatingOrg } = useCreateOrganization();
  const { mutate: setActive, isPending: isSettingActive } = useSetActiveOrganization();

  const handleFinish = () => {
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

    // Step 1: Create organization (barbershop)
    createOrg(
      {
        name: formData.name!,
        slug: formData.slug!,
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

                router.push("/create-barbershop-invite-barber-empty");
              } catch (error) {
                console.log(error)
                toast.error(getErrorMessage(error));
              }
            },
            onError: (error) => {
              toast.error("Failed to set active organization: " + error.message);
            },
          });
        },
        onError: (error) => {
          toast.error("Failed to create organization: " + error.message);
        },
      }
    );
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
        label={isCreatingOrg || isSettingActive ? "Setting up..." : "Finish Setup"}
        style={styles.button}
        onPress={handleFinish}
        disabled={!isValid || isCreatingOrg || isSettingActive}
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
