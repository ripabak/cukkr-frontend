import { Colors } from "@/src/theme/colors";
import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/features/workspace/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { validateBarbershopName } from "../utils/form-validators";

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [name, setName] = useState(formData.name || "");

  const validation = validateBarbershopName(name);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handleCreate = () => {
    if (!validation.isValid) return;

    updateFormData({ name });
    router.push("/d/create-barbershop-first-service");
  };

  const isValid = validation.isValid;

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={2} currentStep={0} style={styles.wizard} />
      <Text style={styles.title}>Create Barbershop</Text>
      <Text style={styles.subtitle}>Set up your own barbershop</Text>

      <TextInputField
        label="Barbershop Name"
        placeholder="Barbershop name"
        value={name}
        onChangeText={handleNameChange}
      />

      <Text style={styles.logoLabel}>Logo</Text>
      <ImageUploadBox
        label="Choose Image"
        style={styles.imageUpload}
        onPress={() => {
          console.log("TODO: Open image picker");
        }}
      />

      <View style={styles.flex} />
      <PrimaryButton
        label="Next"
        style={styles.button}
        onPress={handleCreate}
        disabled={!isValid}
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
});
