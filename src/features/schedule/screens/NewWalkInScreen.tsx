import { Colors } from "@/src/theme/colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingForm } from "@/src/features/schedule/components/BookingForm";
import { BookingTypeToggle } from "@/src/features/schedule/components/BookingTypeToggle";
import { FormShell } from "@/src/features/schedule/components/FormShell";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useCreateBooking } from "@/src/features/schedule/hooks";
import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type BookingType = "appointment" | "walkin";

export function NewWalkInScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { formData, updateFormData, resetFormData } = useNewBookingForm();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const [bookingType, setBookingType] = useState<BookingType>("walkin");

  const isValid =
    formData.customerName.trim().length > 0 &&
    formData.serviceIds.length > 0;

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === "appointment") {
      router.replace("/d/new-appointment");
    }
  }

  function handleSubmit() {
    if (!formData.customerName.trim()) {
      toast.error(t("schedule.pleaseEnterName"));
      return;
    }
    if (formData.serviceIds.length === 0) {
      toast.error(t("schedule.pleaseSelectService"));
      return;
    }

    createBooking(
      {
        type: "walk_in",
        customerName: formData.customerName,
        serviceIds: formData.serviceIds,
        barberId: formData.barberId ?? undefined,
        customerEmail: formData.email || null,
        notes: formData.notes || null,
      },
      {
        onSuccess: () => {
          toast.success(t("toast.createSuccess"));
          resetFormData();
          router.back();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  }

  return (
    <FormShell
      keyboardAvoid
      hideAppHeader
      headerSlot={
        <ScreenHeader
          title={t("schedule.newWalkIn")}
          onBack={() => router.back()}
          rightAction={
            <BookingTypeToggle
              value={bookingType}
              onChange={handleBookingTypeChange}
            />
          }
        />
      }
      footerSlot={
        <View style={styles.footer}>
          <PrimaryButton
            label={t("schedule.newWalkIn")}
            onPress={handleSubmit}
            disabled={isPending || !isValid}
          />
        </View>
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 24 }}
    >
      <BookingForm
        customerName={formData.customerName}
        onCustomerNameChange={(v) => updateFormData({ customerName: v })}
        email={formData.email}
        onEmailChange={(v) => updateFormData({ email: v })}
        selectedBarber={formData.barberName ?? undefined}
        selectedBarberAvatarUrl={formData.barberAvatarUrl ?? undefined}
        onBarberPress={() => router.push("/d/select-barber")}
        showDateTimeSelector={false}
        services={formData.selectedServices}
        onServicePress={() => router.push("/d/select-services")}
      />
    </FormShell>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
