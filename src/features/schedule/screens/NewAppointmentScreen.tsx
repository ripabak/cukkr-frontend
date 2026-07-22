import { Colors } from "@/src/theme/colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useOpenHours } from "@/src/hooks/useOpenHours";
import { BookingForm } from "@/src/features/schedule/components/BookingForm";
import { BookingTypeToggle } from "@/src/features/schedule/components/BookingTypeToggle";
import { FormShell } from "@/src/features/schedule/components/FormShell";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useCreateBooking } from "@/src/features/schedule/hooks";
import { useBarbershopCurrent } from "@/src/features/barbershop/hooks";
import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type BookingType = "appointment" | "walkin";

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

function getBarbershopNow(timezone: string) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0');
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') };
}

function isBarbershopToday(selected: Date, tz: string): boolean {
  const bt = getBarbershopNow(tz);
  return selected.getFullYear() === bt.year && selected.getMonth() + 1 === bt.month && selected.getDate() === bt.day;
}

export function NewAppointmentScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t, language } = useI18nContext();
  const { formData, updateFormData, resetFormData } = useNewBookingForm();
  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const { data: openHoursData } = useOpenHours();
  const { data: barbershop } = useBarbershopCurrent();
  const minAdvanceHours = barbershop?.minAdvanceHours ?? 0;
  const maxAdvanceDays = barbershop?.maxAdvanceDays ?? 365;
  const timezone = barbershop?.timezone ?? 'UTC';

  const barbershopNow = useMemo(() => getBarbershopNow(timezone), [timezone]);

  const now = Date.now();
  const minDate = new Date(now + minAdvanceHours * 3600 * 1000);
  const maxDate = new Date(now + maxAdvanceDays * 86400 * 1000);
  const minDateStr = toDateInputValue(minDate);
  const maxDateStr = toDateInputValue(maxDate);

  const [bookingType, setBookingType] = useState<BookingType>("appointment");
  const [showIosPicker, setShowIosPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [tempDate, setTempDate] = useState<Date>(new Date());
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
    setSelectedTimeSlot(undefined);
    setDisplayDateTime(undefined);
    updateFormData({ scheduledAt: null });

    const dayOfWeek = date.getDay();
    const dayHours =
      openHoursData?.find((d) => d.dayOfWeek === dayOfWeek) ?? null;
    setDayAvailability(dayHours);
  }

  function formatDateLocale(date: Date, language: string): string {
    const locale = language === 'id' ? 'id-ID' : 'en-US';
    const dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const monthFormat = new Intl.DateTimeFormat(locale, { month: 'short' });
    return `${dayFormat.format(date)}, ${date.getDate()} ${monthFormat.format(date)} ${date.getFullYear()}`;
  }

  function openDatePicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedDate ?? new Date(),
        mode: 'date',
        minimumDate: minDate,
        maximumDate: maxDate,
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            handleDateSelect(date);
          }
        },
      });
    } else {
      setShowIosPicker(true);
      setTempDate(selectedDate ?? new Date());
    }
  }

  function confirmIosDate() {
    handleDateSelect(tempDate);
    setShowIosPicker(false);
  }

  function handleWebDateChange(e: { target: { value: string } }) {
    const val = e.target.value;
    if (val) {
      handleDateSelect(new Date(val + 'T00:00:00'));
    }
  }

  function handleIosDateChange(event: DateTimePickerEvent, date?: Date) {
    if (date) setTempDate(date);
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
    const label = `${formatDateLocale(selectedDate, language)} ${h12}:${mm} ${amPm}`;
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

    const isToday = isBarbershopToday(selectedDate, timezone);
    const minMinutes = isToday
      ? barbershopNow.hour * 60 + barbershopNow.minute + minAdvanceHours * 60
      : undefined;

    return generateTimeSlots(
      dayAvailability.openTime,
      dayAvailability.closeTime,
      minMinutes
    );
  }, [dayAvailability, selectedDate, minAdvanceHours, timezone, barbershopNow]);

  const displayDateOnly = selectedDate
    ? formatDateLocale(selectedDate, language)
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
      toast.error(t("schedule.pleaseEnterName"));
      return;
    }
    if (!formData.scheduledAt) {
      toast.error(t("schedule.pleaseSelectDateTime"));
      return;
    }
    if (formData.serviceIds.length === 0) {
      toast.error(t("schedule.pleaseSelectService"));
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
      toast.success(t("toast.createSuccess"));
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
          title={t("schedule.newAppointment")}
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
            label={t("schedule.newAppointment")}
            onPress={handleSubmit}
            disabled={isPending || !isValid}
          />
        </View>
      }
      backgroundColor={Colors.bg.default}
      contentStyle={{ paddingTop: 24, gap: 14 }}
    >
      {Platform.OS === 'web' ? (
        <>
          <BookingForm
            customerName={formData.customerName}
            onCustomerNameChange={(v) => updateFormData({ customerName: v })}
            email={formData.email}
            onEmailChange={(v) => updateFormData({ email: v })}
            selectedBarber={formData.barberName ?? undefined}
            selectedBarberAvatarUrl={formData.barberAvatarUrl ?? undefined}
            onBarberPress={() => router.push("/d/select-barber")}
            selectedDateTime={displayDateTime ?? displayDateOnly}
            onDateTimePress={openDatePicker}
            showDateTimeSelector={false}
            services={formData.selectedServices}
            onServicePress={() => router.push("/d/select-services")}
          />
          <View>
            <AppText style={styles.label}>
              {t("schedule.bookingForm.dateTime")} <AppText style={styles.asterisk}>*</AppText>
            </AppText>
            <View style={styles.webDateWrapper}>
              <input
                id="native-date-input"
                type="date"
                value={selectedDate ? toDateInputValue(selectedDate) : ''}
                min={minDateStr}
                max={maxDateStr}
                onChange={handleWebDateChange}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: selectedDate ? Colors.text.primary : Colors.text.muted,
                  padding: 0,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  minHeight: 20,
                }}
              />
            </View>
          </View>
        </>
      ) : (
        <BookingForm
          customerName={formData.customerName}
          onCustomerNameChange={(v) => updateFormData({ customerName: v })}
          email={formData.email}
          onEmailChange={(v) => updateFormData({ email: v })}
          selectedBarber={formData.barberName ?? undefined}
          selectedBarberAvatarUrl={formData.barberAvatarUrl ?? undefined}
          onBarberPress={() => router.push("/d/select-barber")}
          selectedDateTime={displayDateTime ?? displayDateOnly}
          onDateTimePress={openDatePicker}
          showDateTimeSelector
          services={formData.selectedServices}
          onServicePress={() => router.push("/d/select-services")}
        />
      )}

      {selectedDate && (
        <View>
          {dayAvailability && !dayAvailability.isOpen ? (
            <View style={styles.closedBox}>
              <AppText style={styles.closedText}>
                {t("schedule.barbershopClosed")}
              </AppText>
            </View>
          ) : timeSlots.length > 0 ? (
            <View>
              <AppText style={styles.timeSectionLabel}>{t("schedule.selectTime")}</AppText>
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

      {Platform.OS === 'ios' && showIosPicker && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowIosPicker(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.pickerCard}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                minimumDate={minDate}
                maximumDate={maxDate}
                onChange={handleIosDateChange}
              />
              <PrimaryButton label="Done" onPress={confirmIosDate} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </FormShell>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  asterisk: {
    color: Colors.status.danger,
  },
  webDateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border.default,
    gap: 10,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    gap: 16,
  },
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
