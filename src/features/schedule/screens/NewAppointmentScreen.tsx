import { Colors } from '@/src/theme/colors';
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { TimePickerModal } from "@/src/components/TimePickerModal";
import { useOpenHours } from "@/src/features/barbershop/hooks";
import { BookingForm } from "@/src/features/schedule/components/BookingForm";
import { BookingTypeToggle } from "@/src/features/schedule/components/BookingTypeToggle";
import { CalendarModal } from "@/src/features/schedule/components/CalendarModal";
import { FormShell } from "@/src/features/schedule/components/FormShell";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useCreateBooking } from "@/src/features/schedule/hooks";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type BookingType = "appointment" | "walkin";

function formatTime(h: number, m: number, amPm: "AM" | "PM"): string {
  const mm = m < 10 ? `0${m}` : String(m);
  return `${h}:${mm} ${amPm}`;
}

function buildISODateTime(date: Date, h: number, m: number, amPm: "AM" | "PM"): string {
  const hour24 = amPm === "AM" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
  const d = new Date(date);
  d.setHours(hour24, m, 0, 0);
  return d.toISOString();
}

interface TimePoint {
  hour24: number;
  minute: number;
}

function parseTime24(str: string): TimePoint {
  const [h, m] = str.split(":").map(Number);
  return { hour24: h, minute: m };
}

function toInitial12h(hour24: number, minute: number): { hour: number; minute: number; amPm: "AM" | "PM" } {
  if (hour24 === 0) return { hour: 12, minute, amPm: "AM" };
  if (hour24 < 12) return { hour: hour24, minute, amPm: "AM" };
  if (hour24 === 12) return { hour: 12, minute, amPm: "PM" };
  return { hour: hour24 - 12, minute, amPm: "PM" };
}

export function NewAppointmentScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData, resetFormData } = useNewBookingForm();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { data: openHoursData } = useOpenHours();

  const [bookingType, setBookingType] = useState<BookingType>("appointment");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [displayDateTime, setDisplayDateTime] = useState<string | undefined>();
  const [minTime, setMinTime] = useState<TimePoint | undefined>();
  const [maxTime, setMaxTime] = useState<TimePoint | undefined>();
  const [initialPickerTime, setInitialPickerTime] = useState<{ hour: number; minute: number; amPm: "AM" | "PM" }>({ hour: 9, minute: 0, amPm: "AM" });

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setShowCalendar(false);

    const dayOfWeek = date.getDay();
    const dayHours = openHoursData?.find((d) => d.dayOfWeek === dayOfWeek);

    if (!dayHours || !dayHours.isOpen || !dayHours.openTime || !dayHours.closeTime) {
      toast.error("Barbershop is closed on this day");
      return;
    }

    const open = parseTime24(dayHours.openTime);
    const close = parseTime24(dayHours.closeTime);
    setMinTime(open);
    setMaxTime(close);
    setInitialPickerTime(toInitial12h(open.hour24, open.minute));
    setShowTimePicker(true);
  }

  function handleTimeConfirm(h: number, m: number, amPm: "AM" | "PM") {
    if (selectedDate) {
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const label = `${dayLabels[selectedDate.getDay()]}, ${selectedDate.getDate()} ${monthLabels[selectedDate.getMonth()]} ${selectedDate.getFullYear()} ${formatTime(h, m, amPm)}`;
      setDisplayDateTime(label);
      updateFormData({ scheduledAt: buildISODateTime(selectedDate, h, m, amPm) });
    }
    setShowTimePicker(false);
  }

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === "walkin") {
      router.replace("/new-walk-in");
    }
  }

  function handleSubmit() {
    if (!formData.customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (!formData.scheduledAt) {
      toast.error("Please select date and time");
      return;
    }
    if (formData.serviceIds.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    createBooking(
      {
        type: "appointment",
        customerName: formData.customerName,
        serviceIds: formData.serviceIds,
        scheduledAt: formData.scheduledAt,
        barberId: formData.barberId ?? undefined,
        customerPhone: formData.contact || null,
        notes: formData.notes || null,
      },
      {
        onSuccess: () => {
          toast.success("Appointment created");
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
      headerSlot={
        <ScreenHeader
          title="New Appointment"
          onBack={() => router.back()}
          rightAction={
            <BookingTypeToggle value={bookingType} onChange={handleBookingTypeChange} />
          }
        />
      }
      footerSlot={
        <View style={styles.footer}>
          <PrimaryButton
            label="New Appointment"
            onPress={handleSubmit}
            disabled={isPending}
          />
        </View>
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 20, gap: 14 }}
    >
      <BookingForm
        customerName={formData.customerName}
        onCustomerNameChange={(v) => updateFormData({ customerName: v })}
        contact={formData.contact}
        onContactChange={(v) => updateFormData({ contact: v })}
        selectedBarber={formData.barberName ?? undefined}
        onBarberPress={() => router.push("/select-barber")}
        selectedDateTime={displayDateTime}
        onDateTimePress={() => setShowCalendar(true)}
        showDateTimeSelector
        services={formData.selectedServices}
        onServicePress={() => router.push("/select-services")}
      />

      <CalendarModal
        visible={showCalendar}
        selectedDate={selectedDate}
        openHours={openHoursData ?? []}
        onSelect={handleDateSelect}
        onClose={() => setShowCalendar(false)}
      />
      <TimePickerModal
        visible={showTimePicker}
        initialHour={initialPickerTime.hour}
        initialMinute={initialPickerTime.minute}
        initialAmPm={initialPickerTime.amPm}
        minTime={minTime}
        maxTime={maxTime}
        onConfirm={handleTimeConfirm}
        onClose={() => setShowTimePicker(false)}
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
