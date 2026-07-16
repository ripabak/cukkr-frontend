import { Colors } from "@/src/theme/colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useOpenHours } from "@/src/hooks/useOpenHours";
import { BookingForm } from "@/src/features/schedule/components/BookingForm";
import { BookingTypeToggle } from "@/src/features/schedule/components/BookingTypeToggle";
import { CalendarModal } from "@/src/features/schedule/components/CalendarModal";
import { FormShell } from "@/src/features/schedule/components/FormShell";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useCreateBooking } from "@/src/features/schedule/hooks";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/src/components/AppText";

type BookingType = "appointment" | "walkin";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateTimeSlots(
  openTime: string,
  closeTime: string,
  minMinutes?: number
): string[] {
  const slots: string[] = [];
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  const min = minMinutes ?? 0;
  while (cur < end) {
    if (cur >= min) {
      const hh = Math.floor(cur / 60);
      const mm = cur % 60;
      slots.push(
        `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
      );
    }
    cur += 30;
  }
  return slots;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function NewAppointmentScreen() {
  const router = useRouter();
  const toast = useToast();
  const { formData, updateFormData, resetFormData } = useNewBookingForm();
  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const { data: openHoursData } = useOpenHours();

  const [bookingType, setBookingType] = useState<BookingType>("appointment");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dayAvailability, setDayAvailability] = useState<{
    isOpen: boolean;
    openTime: string | null;
    closeTime: string | null;
  } | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const [displayDateTime, setDisplayDateTime] = useState<string | undefined>();

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setShowCalendar(false);
    setSelectedTimeSlot(undefined);
    setDisplayDateTime(undefined);
    updateFormData({ scheduledAt: null });

    const dayOfWeek = date.getDay();
    const dayHours =
      openHoursData?.find((d) => d.dayOfWeek === dayOfWeek) ?? null;
    setDayAvailability(dayHours);
  }

  function handleTimeSlotSelect(slot: string) {
    if (!selectedDate) return;
    setSelectedTimeSlot(slot);
    const [h, m] = slot.split(":").map(Number);
    const d = new Date(selectedDate);
    d.setHours(h, m, 0, 0);
    const amPm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const mm = String(m).padStart(2, "0");
    const label = `${DAY_LABELS[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_LABELS[selectedDate.getMonth()]} ${selectedDate.getFullYear()} ${h12}:${mm} ${amPm}`;
    setDisplayDateTime(label);
    updateFormData({ scheduledAt: d.toISOString() });
  }

  const timeSlots = useMemo(() => {
    if (
      !dayAvailability?.isOpen ||
      !dayAvailability.openTime ||
      !dayAvailability.closeTime
    )
      return [];
    if (!selectedDate) return [];

    const isToday = isSameDay(selectedDate, new Date());
    const minMinutes = isToday
      ? new Date().getHours() * 60 + new Date().getMinutes()
      : undefined;

    return generateTimeSlots(
      dayAvailability.openTime,
      dayAvailability.closeTime,
      minMinutes
    );
  }, [dayAvailability, selectedDate]);

  const displayDateOnly = selectedDate
    ? `${DAY_LABELS[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_LABELS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : undefined;

  const isValid =
    formData.customerName.trim().length > 0 &&
    formData.scheduledAt !== null &&
    formData.serviceIds.length > 0;

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === "walkin") {
      router.replace("/d/new-walk-in");
    }
  }

  async function handleSubmit() {
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

    try {
      await createBooking({
        type: "appointment",
        customerName: formData.customerName,
        customerEmail: formData.email || null,
        serviceIds: formData.serviceIds,
        scheduledAt: formData.scheduledAt,
        barberId: formData.barberId ?? undefined,
        notes: formData.notes || null,
      });
      toast.success("Appointment created");
      resetFormData();
      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <FormShell
      keyboardAvoid
      hideAppHeader
      headerSlot={
        <ScreenHeader
          title="New Appointment"
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
            label="New Appointment"
            onPress={handleSubmit}
            disabled={isPending || !isValid}
          />
        </View>
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 24, gap: 14 }}
    >
      <BookingForm
        customerName={formData.customerName}
        onCustomerNameChange={(v) => updateFormData({ customerName: v })}
        email={formData.email}
        onEmailChange={(v) => updateFormData({ email: v })}
        selectedBarber={formData.barberName ?? undefined}
        onBarberPress={() => router.push("/d/select-barber")}
        selectedDateTime={displayDateTime ?? displayDateOnly}
        onDateTimePress={() => setShowCalendar(true)}
        showDateTimeSelector
        services={formData.selectedServices}
        onServicePress={() => router.push("/d/select-services")}
      />

      {selectedDate && (
        <View>
          {dayAvailability && !dayAvailability.isOpen ? (
            <View style={styles.closedBox}>
              <AppText style={styles.closedText}>
                Barbershop is closed on this date. Please choose another date.
              </AppText>
            </View>
          ) : timeSlots.length > 0 ? (
            <View>
              <AppText style={styles.timeSectionLabel}>Select a time</AppText>
              <View style={styles.slotsGrid}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotBtn,
                      selectedTimeSlot === slot && styles.slotBtnSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleTimeSlotSelect(slot)}
                  >
                    <AppText
                      style={[
                        styles.slotText,
                        selectedTimeSlot === slot && styles.slotTextSelected,
                      ]}
                    >
                      {slot}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      )}

      <CalendarModal
        visible={showCalendar}
        selectedDate={selectedDate}
        openHours={openHoursData ?? []}
        onSelect={handleDateSelect}
        onClose={() => setShowCalendar(false)}
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
  timeSectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  closedBox: {
    borderWidth: 1.5,
    borderColor: Colors.status.danger,
    borderRadius: 12,
    backgroundColor: Colors.status.dangerSurface,
    padding: 14,
  },
  closedText: {
    fontSize: 14,
    color: Colors.status.danger,
    lineHeight: 20,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slotBtn: {
    width: "22%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
  },
  slotBtnSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primary,
  },
  slotText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  slotTextSelected: {
    color: Colors.text.primary,
  },
});
