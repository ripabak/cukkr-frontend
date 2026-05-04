import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useCallback, useState, useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { useBarbershopSlugCheck } from "../hooks";
import { useToast } from "@/src/lib/providers";
import { validateBarbershopName } from "../utils/form-validators";
import { generateSlug } from "../utils/slug-generator";

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [name, setName] = useState(formData.name || "");

  const validation = validateBarbershopName(name);
  const slug = useMemo(() => generateSlug(name), [name]);
  const { data: isAvailable, isLoading: isCheckingSlug, error } = useBarbershopSlugCheck(slug);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handleCreate = () => {
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.message);
      return;
    }

    if (isAvailable !== true) {
      Alert.alert("Error", "Barbershop name is not available");
      return;
    }

    updateFormData({ name, slug });
    router.push("/create-barbershop-first-service");
  };

  const isValid = validation.isValid && isAvailable === true;

  let slugMessage = "";
  let messageColor = "#FF9500";
  if (isCheckingSlug) {
    slugMessage = "Checking availability...";
  } else if (error) {
    slugMessage = "Error checking availability";
    messageColor = "#FF3B30";
  } else if (isAvailable === true) {
    slugMessage = "Available ✓";
    messageColor = "#34C759";
  } else if (isAvailable === false) {
    slugMessage = "Not available";
    messageColor = "#FF3B30";
  }

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={0} style={styles.wizard} />
      <Text style={styles.title}>Create Barbershop</Text>
      <Text style={styles.subtitle}>Set up your own barbershop</Text>

      <TextInputField
        label="Barbershop Name"
        placeholder="Barbershop name"
        value={name}
        onChangeText={handleNameChange}
      />

      {name && (
        <View style={styles.slugInfo}>
          <Text style={styles.slugLabel}>URL: {slug}</Text>
          {slugMessage && (
            <Text style={[styles.slugMessage, { color: messageColor }]}>
              {slugMessage}
            </Text>
          )}
        </View>
      )}

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
        disabled={!isValid || isCheckingSlug}
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
  slugInfo: {
    marginTop: 8,
    marginBottom: 16,
  },
  slugLabel: {
    fontSize: 12,
    color: "#666666",
  },
  slugMessage: {
    fontSize: 12,
    marginTop: 4,
  },
  logoLabel: {
    fontSize: 13,
    color: "#666666",
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
