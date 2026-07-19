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
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

type Mode = "name" | "description" | "address";

function getModeConfig(t: (key: string, params?: Record<string, string>) => string): Record<
  Mode,
  {
    title: string;
    placeholder: string;
    helperLines: string[];
    multiline: boolean;
  }
> {
  return {
    name: {
      title: t("barbershop.nameLabel"),
      placeholder: t("barbershop.editNamePlaceholder"),
      helperLines: [
        t("barbershop.editNameHelper1"),
        t("barbershop.editNameHelper2"),
      ],
      multiline: false,
    },
    description: {
      title: t("barbershop.description") || "Description",
      placeholder: t("barbershop.editDescPlaceholder"),
      helperLines: [
        t("barbershop.editDescHelper1"),
        t("barbershop.editDescHelper2"),
      ],
      multiline: true,
    },
    address: {
      title: t("barbershop.addressLabel"),
      placeholder: t("barbershop.editAddressPlaceholder"),
      helperLines: [
        t("barbershop.editAddressHelper1"),
        t("barbershop.editAddressHelper2"),
      ],
      multiline: true,
    },
  };
}

export function EditBarbershopInfoScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
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
      toast.error(t("common.error"));
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
        toast.success(t("toast.updateSuccess"));
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || t("toast.unknownError"));
      },
    });
  };

  const config = getModeConfig(t)[mode];

  return (
    <ScreenShell
      hideAppHeader
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
          <AppText style={styles.viewOnlyText}>{t("common.noPermission")}</AppText>
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
    paddingBottom: 200,
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
