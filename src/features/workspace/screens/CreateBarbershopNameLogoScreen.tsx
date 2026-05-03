import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { barbershopService } from "../services";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils";
import { validateBarbershopName } from "../utils/form-validators";
import { generateSlug } from "../utils/slug-generator";

const SLUG_CHECK_DELAY = 500; // ms

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData } = useCreateBarbershopForm();
  const [name, setName] = useState(formData.name || "");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugCheckMessage, setSlugCheckMessage] = useState("");
  const slugCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced slug checker
  useEffect(() => {
    // Clear previous timeout
    if (slugCheckTimeoutRef.current) {
      clearTimeout(slugCheckTimeoutRef.current);
    }

    // Validate name first
    const validation = validateBarbershopName(name);
    if (!validation.isValid) {
      setSlugAvailable(null);
      setSlugCheckMessage("");
      return;
    }

    // Set timeout for slug check
    setIsCheckingSlug(true);
    setSlugCheckMessage("Checking availability...");

    slugCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const slug = generateSlug(name);
        const available = await barbershopService.checkSlugAvailability(slug);
        setSlugAvailable(available);
        setSlugCheckMessage(available ? "Available ✓" : "Not available");
      } catch (error) {
        toast.error(getErrorMessage(error), 2000);
        setSlugAvailable(false);
        setSlugCheckMessage("Error checking availability");
      } finally {
        setIsCheckingSlug(false);
      }
    }, SLUG_CHECK_DELAY);

    // Cleanup on unmount
    return () => {
      if (slugCheckTimeoutRef.current) {
        clearTimeout(slugCheckTimeoutRef.current);
      }
    };
  }, [name]);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handleCreate = async () => {
    const validation = validateBarbershopName(name);
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.message);
      return;
    }

    if (slugAvailable !== true) {
      Alert.alert("Error", "Please check that the barbershop name is available");
      return;
    }

    const slug = generateSlug(name);
    updateFormData({ name, slug });
    router.push("/create-barbershop-first-service");
  };

  const slug = generateSlug(name);
  const isValid = validateBarbershopName(name).isValid && slugAvailable === true;
  const messageColor =
    slugCheckMessage === "Available ✓"
      ? "#34C759"
      : slugCheckMessage === "Not available"
        ? "#FF3B30"
        : "#FF9500";

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
          {slugCheckMessage && (
            <Text style={[styles.slugMessage, { color: messageColor }]}>
              {slugCheckMessage}
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
