import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingForm } from "@/src/features/schedule/components/BookingForm";
import { BookingTypeToggle } from "@/src/features/schedule/components/BookingTypeToggle";
import { FormShell } from "@/src/features/schedule/components/FormShell";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useCreateBooking } from "@/src/features/schedule/hooks";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type BookingType = "appointment" | "walkin";

export function NewWalkInScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData, resetFormData } = useNewBookingForm();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const [bookingType, setBookingType] = useState<BookingType>("walkin");

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === "appointment") {
      router.replace("/new-appointment");
    }
  }

  function handleSubmit() {
    if (!formData.customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (formData.serviceIds.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    createBooking(
      {
        type: "walk_in",
        customerName: formData.customerName,
        serviceIds: formData.serviceIds,
        barberId: formData.barberId ?? undefined,
        customerPhone: formData.contact || null,
        notes: formData.notes || null,
      },
      {
        onSuccess: () => {
          toast.success("Walk-in created");
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
      headerSlot={
        <ScreenHeader
          title="New Walk-In"
          onBack={() => router.back()}
          rightAction={
            <BookingTypeToggle value={bookingType} onChange={handleBookingTypeChange} />
          }
        />
      }
      footerSlot={
        <View style={styles.footer}>
          <PrimaryButton
            label="New Walk-In"
            onPress={handleSubmit}
            disabled={isPending}
          />
        </View>
      }
      backgroundColor="#F5F4E8"
      contentStyle={{ paddingTop: 20 }}
    >
      <BookingForm
        customerName={formData.customerName}
        onCustomerNameChange={(v) => updateFormData({ customerName: v })}
        contact={formData.contact}
        onContactChange={(v) => updateFormData({ contact: v })}
        selectedBarber={formData.barberName ?? undefined}
        onBarberPress={() => router.push("/select-barber")}
        showDateTimeSelector={false}
        services={formData.selectedServices}
        onServicePress={() => router.push("/select-services")}
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
