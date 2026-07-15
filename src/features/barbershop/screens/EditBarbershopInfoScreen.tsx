import { Colors } from "@/src/theme/colors";
import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import {
  useBarbershopCurrent,
  useUpdateBarbershopSettings,
} from "@/src/features/barbershop/hooks";
import { useMemberRole } from "@/src/hooks";
import { useToast } from "@/src/lib/providers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

type Mode = "name" | "description" | "address";

const MODE_CONFIG: Record<
  Mode,
  {
    title: string;
    placeholder: string;
    helperLines: string[];
    multiline: boolean;
  }
> = {
  name: {
    title: "Name",
    placeholder: "Barbershop Name",
    helperLines: [
      "Enter your barbershop name as you want it to appear to customers.",
      "This name will be shown on the booking page, notifications, and reports.",
    ],
    multiline: false,
  },
  description: {
    title: "Description",
    placeholder: "Barbershop Description",
    helperLines: [
      "Describe your barbershop to attract customers.",
      "This will appear on your public booking page.",
    ],
    multiline: true,
  },
  address: {
    title: "Address",
    placeholder: "Barbershop Address",
    helperLines: [
      "Enter the full address of your barbershop.",
      "This helps customers find your location.",
    ],
    multiline: false,
  },
};

export function EditBarbershopInfoScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode =
    params.mode === "name" ||
    params.mode === "description" ||
    params.mode === "address"
      ? params.mode
      : "name";

  const { data: barbershop, isLoading: isFetching } = useBarbershopCurrent();
  const { mutate: updateSettings, isPending: isSaving } =
    useUpdateBarbershopSettings();
  const { role } = useMemberRole();
  const isOwner = role === "owner";
  const [value, setValue] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (barbershop && !initialized) {
      const initial =
        mode === "name"
          ? barbershop.name
          : mode === "description"
            ? (barbershop.description ?? "")
            : (barbershop.address ?? "");
      setValue(initial);
      setInitialized(true);
    }
  }, [barbershop, initialized, mode]);

  const handleSave = () => {
    if (mode === "name" && !value.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const payload =
      mode === "name"
        ? { name: value.trim() }
        : mode === "description"
          ? { description: value.trim() || null }
          : { address: value.trim() || null };

    updateSettings(payload, {
      onSuccess: () => {
        toast.success(`${MODE_CONFIG[mode].title} updated`);
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update");
      },
    });
  };

  const config = MODE_CONFIG[mode];

  return (
    <ScreenShell
      headerSlot={
        <EditFieldHeader
          title={config.title}
          onBack={() => router.back()}
          onSave={isSaving ? undefined : handleSave}
          hideSave={!isOwner}
        />
      }
      contentStyle={styles.content}
    >
      {isFetching && !initialized ? (
        <ActivityIndicator
          size="small"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      ) : config.multiline ? (
        <MultilineInputField
          placeholder={config.placeholder}
          value={value}
          onChangeText={setValue}
          editable={isOwner}
        />
      ) : (
        <TextInputField
          placeholder={config.placeholder}
          value={value}
          onChangeText={setValue}
          editable={isOwner}
        />
      )}
      <HelperCopy lines={config.helperLines} style={styles.helper} />
      {!isOwner && (
        <View style={styles.viewOnlyBanner}>
          <AppText style={styles.viewOnlyText}>Only the barbershop owner can edit this information</AppText>
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
  },
  loader: {
    marginTop: 20,
  },
  helper: {
    marginTop: 16,
  },
  viewOnlyBanner: {
    marginTop: 24,
    padding: 12,
    backgroundColor: Colors.bg.surface,
    borderRadius: 8,
    alignItems: "center",
  },
  viewOnlyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
});
