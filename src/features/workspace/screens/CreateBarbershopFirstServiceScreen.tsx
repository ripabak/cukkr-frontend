import { MultilineInputField } from "@/src/components/MultilineInputField";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- MOCK DATA ---
const MOCK_INITIAL_PRICE = "40000";
const MOCK_INITIAL_DURATION = "30";

export function CreateBarbershopFirstServiceScreen() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(MOCK_INITIAL_PRICE);
  const [duration, setDuration] = useState(MOCK_INITIAL_DURATION);

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={2} style={styles.wizard} />
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
      <PrefixedInputField prefix="Rp" value={price} onChangeText={setPrice} />
      <Text style={[styles.fieldLabel, styles.fieldLabelTop]}>Duration</Text>
      <PrefixedInputField
        prefix="In Minutes"
        value={duration}
        onChangeText={setDuration}
      />
      <View style={styles.flex} />
      <TouchableOpacity
        style={styles.finishBtn}
        activeOpacity={0.8}
        onPress={() => router.push("/create-barbershop-success")}
      >
        <Text style={styles.finishLabel}>Finish</Text>
      </TouchableOpacity>
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
  finishBtn: {
    backgroundColor: "#C6FF4D",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  finishLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
});
