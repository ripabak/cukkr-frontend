import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { Permission } from "@/src/components/Permission";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import {
  useBarbershopCurrent,
  useUpdateBookingWindow,
} from "@/src/features/barbershop/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

export function BookingPreferencesScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();

  const { data: barbershop, isLoading: isFetching } = useBarbershopCurrent();
  const { mutate: updateBookingWindow, isPending: isSaving } =
    useUpdateBookingWindow();

  const [minHours, setMinHours] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (barbershop && !initialized) {
      setMinHours(String(barbershop.minAdvanceHours));
      setMaxDays(String(barbershop.maxAdvanceDays));
      setInitialized(true);
    }
  }, [barbershop, initialized]);

  const parsedMin = parseInt(minHours, 10);
  const parsedMax = parseInt(maxDays, 10);
  const isMinValid = !isNaN(parsedMin) && parsedMin >= 1 && parsedMin <= 168;
  const isMaxValid = !isNaN(parsedMax) && parsedMax >= 1 && parsedMax <= 365;
  const isConsistent =
    isMinValid && isMaxValid && parsedMax * 24 > parsedMin;
  const isChanged =
    initialized &&
    (parsedMin !== barbershop?.minAdvanceHours ||
      parsedMax !== barbershop?.maxAdvanceDays);

  const canSave =
    initialized && isMinValid && isMaxValid && isConsistent && isChanged && !isSaving;

  const handleSave = () => {
    if (!canSave) return;

    updateBookingWindow(
      { minAdvanceHours: parsedMin, maxAdvanceDays: parsedMax },
      {
        onSuccess: () => {
          toast.success(t("barbershop.settingsSaved"));
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || t("toast.unknownError"));
        },
      },
    );
  };

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <EditFieldHeader
          title={t("barbershop.bookingPreferences")}
          onBack={() => router.back()}
          onSave={canSave ? handleSave : undefined}
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
      ) : (
        <>
          <TextInputField
            label={t("barbershop.minAdvanceHours")}
            placeholder="2"
            value={minHours}
            onChangeText={(text) => setMinHours(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            editable={!isSaving}
          />
          {minHours.length > 0 && !isMinValid && (
            <AppText style={styles.feedbackError}>
              {t("barbershop.minAdvanceHoursError")}
            </AppText>
          )}

          <TextInputField
            label={t("barbershop.maxAdvanceDays")}
            placeholder="30"
            value={maxDays}
            onChangeText={(text) => setMaxDays(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            editable={!isSaving}
            style={styles.secondField}
          />
          {maxDays.length > 0 && !isMaxValid && (
            <AppText style={styles.feedbackError}>
              {t("barbershop.maxAdvanceDaysError")}
            </AppText>
          )}

          {isMinValid && isMaxValid && !isConsistent && (
            <AppText style={styles.feedbackError}>
              {t("barbershop.bookingWindowInconsistent")}
            </AppText>
          )}

          <HelperCopy
            lines={[
              t("barbershop.bookingWindowHelper1"),
              t("barbershop.bookingWindowHelper2"),
            ]}
            style={styles.helper}
          />

          <Permission roles={["member"]}>
            <View style={styles.viewOnlyBanner}>
              <AppText style={styles.viewOnlyText}>
                {t("common.noPermission")}
              </AppText>
            </View>
          </Permission>
        </>
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
  secondField: {
    marginTop: 8,
  },
  helper: {
    marginTop: 8,
  },
  feedbackError: {
    fontSize: 13,
    color: Colors.status.danger,
    marginTop: 4,
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
