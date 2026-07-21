import { Colors } from "@/src/theme/colors";
import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { Permission } from "@/src/components/Permission";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import {
  useServiceById,
  useUpdateService,
} from "@/src/features/barbershop/hooks";
import { useMemberRole } from "@/src/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

type Mode = "name" | "description" | "price" | "duration" | "discount";

function getModeConfig(): Record<
  Mode,
  {
    titleKey: string;
    placeholderKey: string;
    helperKeys: string[];
    modeType: "text" | "multiline";
    labelKey?: string;
    keyboardType?: "default" | "numeric";
  }
> {
  return {
    name: {
      titleKey: "services.serviceName",
      placeholderKey: "services.namePlaceholder",
      helperKeys: ["services.editNameHelper1", "services.editNameHelper2"],
      modeType: "text",
    },
    description: {
      titleKey: "services.descriptionLabel",
      placeholderKey: "services.descriptionPlaceholder",
      helperKeys: ["services.editDescHelper1", "services.editDescHelper2"],
      modeType: "multiline",
    },
    price: {
      titleKey: "services.price",
      placeholderKey: "services.pricePlaceholder",
      helperKeys: ["services.editPriceHelper1", "services.editPriceHelper2"],
      modeType: "text",
      labelKey: "services.priceLabel",
      keyboardType: "numeric",
    },
    duration: {
      titleKey: "services.duration",
      placeholderKey: "services.durationPlaceholder",
      helperKeys: ["services.editDurationHelper1", "services.editDurationHelper2"],
      modeType: "text",
      labelKey: "services.duration",
      keyboardType: "numeric",
    },
    discount: {
      titleKey: "services.discount",
      placeholderKey: "services.discountPlaceholder",
      helperKeys: ["services.editDiscountHelper1", "services.editDiscountHelper2"],
      modeType: "text",
      labelKey: "services.discountLabel",
      keyboardType: "numeric",
    },
  };
}

export function EditServiceInfoScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const params = useLocalSearchParams<{ mode?: string; serviceId?: string }>();
  const serviceId = params.serviceId ?? "";
  const mode: Mode =
    params.mode === "name" ||
    params.mode === "description" ||
    params.mode === "price" ||
    params.mode === "duration" ||
    params.mode === "discount"
      ? params.mode
      : "name";

  const { data: service, isLoading: isFetching } = useServiceById(serviceId);
  const { mutate: updateService, isPending: isSaving } = useUpdateService();
  const { role } = useMemberRole();
  const canManage = role === "owner" || role === "admin";
  const [value, setValue] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (service && !initialized) {
      const initial =
        mode === "name"
          ? service.name
          : mode === "description"
            ? (service.description ?? "")
            : mode === "price"
              ? String(service.price)
              : mode === "duration"
                ? String(service.duration)
                : service.discount > 0
                  ? String(service.discount)
                  : "";
      setValue(initial);
      setInitialized(true);
    }
  }, [service, initialized, mode]);

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
          : mode === "price"
            ? { price: parseFloat(value) || 0 }
            : mode === "duration"
              ? { duration: parseInt(value, 10) || 0 }
              : { discount: value ? parseFloat(value) : 0 };

    updateService(
      { id: serviceId, data: payload },
      {
        onSuccess: () => {
          toast.success(t("toast.updateSuccess"));
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || t("toast.unknownError"));
        },
      },
    );
  };

  const config = getModeConfig()[mode];

  const renderInput = () => {
    if (isFetching && !initialized) {
      return (
        <ActivityIndicator
          size="small"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      );
    }

    switch (config.modeType) {
      case "multiline":
        return (
          <MultilineInputField
            placeholder={t(config.placeholderKey)}
            value={value}
            onChangeText={setValue}
            editable={canManage}
          />
        );
      default:
        return (
          <TextInputField
            label={config.labelKey ? t(config.labelKey) : undefined}
            placeholder={t(config.placeholderKey)}
            value={value}
            onChangeText={setValue}
            keyboardType={config.keyboardType}
            editable={canManage}
          />
        );
    }
  };

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <EditFieldHeader
          title={t(config.titleKey)}
          onBack={() => router.back()}
          onSave={isSaving ? undefined : handleSave}
          hideSave={!canManage}
        />
      }
      contentStyle={styles.content}
    >
      <Permission roles={["owner", "admin"]}>
        {renderInput()}
        <HelperCopy
          lines={config.helperKeys.map((k) => t(k))}
          style={styles.helper}
        />
      </Permission>
      {!canManage && (
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
