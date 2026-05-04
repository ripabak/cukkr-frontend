import { BookingForm } from "@/src/components/BookingForm";
import { BookingTypeToggle } from "@/src/components/BookingTypeToggle";
import { FormShell } from "@/src/components/FormShell";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type BookingType = "appointment" | "walkin";

const MOCK_SERVICES = [{ name: "Hair Cut", price: 40000, isDefault: true }];

export function NewWalkInScreen() {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<BookingType>("walkin");
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [selectedBarber] = useState<string | undefined>();

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === "appointment") {
      router.replace("/new-appointment" as any);
    }
  }

  return (
    <FormShell
      headerSlot={
        <ScreenHeader
          title="New Walk-In"
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
          <PrimaryButton label="New Walk-In" onPress={() => {}} />
        </View>
      }
      backgroundColor="#F5F4E8"
      contentStyle={{ paddingTop: 20 }}
    >
      <BookingForm
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        contact={contact}
        onContactChange={setContact}
        selectedBarber={selectedBarber}
        onBarberPress={() => router.push("/select-barber" as any)}
        showDateTimeSelector={false}
        services={MOCK_SERVICES}
        onServicePress={() => router.push("/select-services" as any)}
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
