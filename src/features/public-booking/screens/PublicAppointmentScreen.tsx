import { CalendarModal } from '@/src/features/schedule/components/CalendarModal';
import { TimePickerModal } from '@/src/components/TimePickerModal';
import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePublicBooking } from '../context/PublicBookingContext';
import { PublicSelectedService } from '../context/PublicBookingContext';
import { publicBookingService } from '../services/public-booking.service';
import {
  useCreatePublicAppointment,
  usePublicFormData,
} from '../hooks';
import { PublicPageContainer } from '../components/PublicPageContainer';

const TOTAL_STEPS = 5;

function formatPrice(p: number) {
  return `Rp ${p.toLocaleString('id-ID')}`;
}

function calcFinalPrice(price: number, discountPercent?: number | null) {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

function formatTime(h: number, m: number, amPm: 'AM' | 'PM'): string {
  const mm = m < 10 ? `0${m}` : String(m);
  return `${h}:${mm} ${amPm}`;
}

function buildISODateTime(date: Date, h: number, m: number, amPm: 'AM' | 'PM'): string {
  const hour24 = amPm === 'AM' ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
  const d = new Date(date);
  d.setHours(hour24, m, 0, 0);
  return d.toISOString();
}

function parseTime24(str: string): { hour24: number; minute: number } {
  const [h, m] = str.split(':').map(Number);
  return { hour24: h, minute: m };
}

function toInitial12h(hour24: number, minute: number) {
  if (hour24 === 0) return { hour: 12, minute, amPm: 'AM' as const };
  if (hour24 < 12) return { hour: hour24, minute, amPm: 'AM' as const };
  if (hour24 === 12) return { hour: 12, minute, amPm: 'PM' as const };
  return { hour: hour24 - 12, minute, amPm: 'PM' as const };
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface StepHeaderProps {
  step: number;
  title: string;
  onBack: () => void;
}

function StepHeader({ step, title, onBack }: StepHeaderProps) {
  return (
    <View style={hStyles.container}>
      <TouchableOpacity onPress={onBack} style={hStyles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
      </TouchableOpacity>
      <View style={hStyles.titleArea}>
        <Text style={hStyles.title} numberOfLines={1}>{title}</Text>
        <Text style={hStyles.stepLabel}>{step} of {TOTAL_STEPS}</Text>
      </View>
    </View>
  );
}

const hStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  titleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text.primary, flex: 1 },
  stepLabel: { fontSize: 13, color: Colors.text.muted, fontWeight: '500' },
});

interface Props {
  slug: string;
}

export function PublicAppointmentScreen({ slug }: Props) {
  const router = useRouter();
  const { state, updateIdentity, setServices, setBarber, setScheduledAt, setNotes, reset } =
    usePublicBooking();

  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [fetchingDay, setFetchingDay] = useState(false);
  const [minTime, setMinTime] = useState<{ hour24: number; minute: number } | undefined>();
  const [maxTime, setMaxTime] = useState<{ hour24: number; minute: number } | undefined>();
  const [initialPickerTime, setInitialPickerTime] = useState<{
    hour: number; minute: number; amPm: 'AM' | 'PM';
  }>({ hour: 9, minute: 0, amPm: 'AM' });

  const { data: formData, isLoading: loadingForm } = usePublicFormData(slug);
  const { mutate: createAppointment, isPending: creating } = useCreatePublicAppointment(slug);

  function handleBack() {
    setLocalError('');
    if (step === 1) {
      reset();
      router.back();
    } else {
      setStep(s => s - 1);
    }
  }

  function handleNext() {
    setLocalError('');
    setStep(s => s + 1);
  }

  function handleIdentityNext() {
    if (!state.identity.name.trim()) {
      setLocalError('Please enter your name');
      return;
    }
    handleNext();
  }

  function handleServicesNext() {
    if (state.serviceIds.length === 0) {
      setLocalError('Please select at least one service');
      return;
    }
    handleNext();
  }

  function handleDateTimeNext() {
    if (!state.scheduledAt) {
      setLocalError('Please select a date and time');
      return;
    }
    handleNext();
  }

  async function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setShowCalendar(false);
    setLocalError('');
    setFetchingDay(true);

    try {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      const dayInfo = await publicBookingService.getDateAvailability(slug, dateStr);

      if (!dayInfo || !dayInfo.isOpen || !dayInfo.openTime || !dayInfo.closeTime) {
        setLocalError('The barbershop is closed on this day. Please select another date.');
        return;
      }

      const open = parseTime24(dayInfo.openTime);
      const close = parseTime24(dayInfo.closeTime);
      setMinTime(open);
      setMaxTime(close);
      setInitialPickerTime(toInitial12h(open.hour24, open.minute));
      setShowTimePicker(true);
    } catch {
      setLocalError('Could not verify schedule. Please try again.');
    } finally {
      setFetchingDay(false);
    }
  }

  function handleTimeConfirm(h: number, m: number, amPm: 'AM' | 'PM') {
    if (!selectedDate) return;
    const label = `${DAY_LABELS[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTH_LABELS[selectedDate.getMonth()]} ${selectedDate.getFullYear()} ${formatTime(h, m, amPm)}`;
    setScheduledAt(buildISODateTime(selectedDate, h, m, amPm), label);
    setShowTimePicker(false);
  }

  function handleSubmit() {
    createAppointment(
      {
        customerName: state.identity.name.trim(),
        customerPhone: state.identity.phone.trim() || null,
        serviceIds: state.serviceIds,
        barberId: state.barberId,
        scheduledAt: state.scheduledAt!,
        notes: state.notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();
        },
        onError: (err: any) => {
          setLocalError(err?.message ?? 'Something went wrong. Please try again.');
        },
      }
    );
  }

  const stepTitles = ['Your Info', 'Services', 'Barber', 'Date & Time', 'Confirm'];

  if (success) {
    return (
      <PublicPageContainer>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.status.success} />
          </View>
          <Text style={styles.successTitle}>Appointment Requested!</Text>
          <Text style={styles.successDesc}>
            Your appointment request has been sent. The barber will confirm your booking shortly.
          </Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace(`/(public)/${slug}` as any)}
          >
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </PublicPageContainer>
    );
  }

  return (
    <PublicPageContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StepHeader step={step} title={stepTitles[step - 1]} onBack={handleBack} />

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` as any }]} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Identity */}
          {step === 1 && (
            <View style={styles.stepBody}>
              <Text style={styles.stepHeading}>Your Information</Text>
              <Text style={styles.stepSub}>Let us know who you are.</Text>

              <Text style={styles.fieldLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={state.identity.name}
                onChangeText={v => updateIdentity({ name: v })}
                placeholder="e.g. John Doe"
                placeholderTextColor={Colors.text.muted}
                autoFocus
              />

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Phone (optional)</Text>
              <TextInput
                style={styles.input}
                value={state.identity.phone}
                onChangeText={v => updateIdentity({ phone: v })}
                placeholder="e.g. 08123456789"
                placeholderTextColor={Colors.text.muted}
                keyboardType="phone-pad"
              />
              {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
            </View>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <View style={styles.stepBody}>
              <Text style={styles.stepHeading}>Select Services</Text>
              <Text style={styles.stepSub}>Choose one or more services.</Text>

              {loadingForm ? (
                <ActivityIndicator color={Colors.brand.primary} style={{ marginTop: 24 }} />
              ) : (
                <View style={styles.serviceList}>
                  {(formData?.services ?? []).map(svc => {
                    const selected = state.serviceIds.includes(svc.id);
                    const finalPrice = calcFinalPrice(svc.price, svc.discountPercent);
                    return (
                      <TouchableOpacity
                        key={svc.id}
                        style={[styles.serviceRow, selected && styles.serviceRowSelected]}
                        activeOpacity={0.7}
                        onPress={() => {
                          const current = state.selectedServices;
                          if (selected) {
                            setServices(current.filter(s => s.id !== svc.id));
                          } else {
                            const newSvc: PublicSelectedService = {
                              id: svc.id,
                              name: svc.name,
                              price: finalPrice,
                              discountPercent: svc.discountPercent,
                            };
                            setServices([...current, newSvc]);
                          }
                        }}
                      >
                        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                          {selected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                        </View>
                        <View style={styles.svcInfo}>
                          <Text style={styles.svcName}>{svc.name}</Text>
                          {svc.discountPercent ? (
                            <Text style={styles.svcOriginalPrice}>{formatPrice(svc.price)}</Text>
                          ) : null}
                        </View>
                        <Text style={styles.svcPrice}>{formatPrice(finalPrice)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
            </View>
          )}

          {/* Step 3: Barber */}
          {step === 3 && (
            <View style={styles.stepBody}>
              <Text style={styles.stepHeading}>Choose a Barber</Text>
              <Text style={styles.stepSub}>Optional — leave as "Any" if you don't have a preference.</Text>

              {loadingForm ? (
                <ActivityIndicator color={Colors.brand.primary} style={{ marginTop: 24 }} />
              ) : (
                <View style={styles.serviceList}>
                  <TouchableOpacity
                    style={[styles.barberRow, state.barberId === null && styles.barberRowSelected]}
                    activeOpacity={0.7}
                    onPress={() => setBarber(null, null)}
                  >
                    <View style={[styles.radioOuter, state.barberId === null && styles.radioOuterSelected]}>
                      {state.barberId === null && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.barberAvatar}>
                      <Ionicons name="people" size={20} color={Colors.text.secondary} />
                    </View>
                    <Text style={styles.barberName}>Any available barber</Text>
                  </TouchableOpacity>

                  {(formData?.barbers ?? []).map(barber => {
                    const selected = state.barberId === barber.id;
                    return (
                      <TouchableOpacity
                        key={barber.id}
                        style={[styles.barberRow, selected && styles.barberRowSelected]}
                        activeOpacity={0.7}
                        onPress={() => setBarber(barber.id, barber.name)}
                      >
                        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                          {selected && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.barberAvatar}>
                          <Text style={styles.barberInitial}>
                            {barber.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.barberName}>{barber.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Step 4: Date & Time */}
          {step === 4 && (
            <View style={styles.stepBody}>
              <Text style={styles.stepHeading}>Select Date &amp; Time</Text>
              <Text style={styles.stepSub}>Pick when you'd like your appointment.</Text>

              <TouchableOpacity
                style={styles.dateTimeSelector}
                activeOpacity={0.7}
                onPress={() => setShowCalendar(true)}
                disabled={fetchingDay}
              >
                <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
                {fetchingDay ? (
                  <ActivityIndicator size="small" color={Colors.brand.primary} style={{ flex: 1 }} />
                ) : (
                  <Text style={[styles.dateTimeSelectorText, !state.displayDateTime && styles.dateTimePlaceholder]}>
                    {state.displayDateTime ?? 'Tap to select date & time'}
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} />
              </TouchableOpacity>

              {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

              <CalendarModal
                visible={showCalendar}
                selectedDate={selectedDate}
                disablePast
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
            </View>
          )}

          {/* Step 5: Confirm */}
          {step === 5 && (
            <View style={styles.stepBody}>
              <Text style={styles.stepHeading}>Confirm Appointment</Text>
              <Text style={styles.stepSub}>Review your appointment details.</Text>

              <View style={styles.summaryCard}>
                <SummaryRow label="Name" value={state.identity.name} />
                <SummaryRow label="Phone" value={state.identity.phone || '—'} />
                <SummaryRow
                  label="Services"
                  value={state.selectedServices.map(s => s.name).join(', ')}
                />
                <SummaryRow label="Barber" value={state.barberName ?? 'Any available'} />
                <SummaryRow label="Date" value={state.displayDateTime ?? '—'} />
                <View style={styles.summaryDivider} />
                <SummaryRow
                  label="Total"
                  value={formatPrice(state.selectedServices.reduce((sum, s) => sum + s.price, 0))}
                  bold
                />
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={state.notes}
                onChangeText={setNotes}
                placeholder="Any special requests?"
                placeholderTextColor={Colors.text.muted}
                multiline
                numberOfLines={3}
              />
              {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step < 5 ? (
            <TouchableOpacity
              style={styles.nextBtn}
              activeOpacity={0.85}
              onPress={
                step === 1 ? handleIdentityNext
                : step === 2 ? handleServicesNext
                : step === 3 ? handleNext
                : handleDateTimeNext
              }
            >
              <Text style={styles.nextBtnText}>Continue</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextBtn, styles.confirmBtn]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.nextBtnText}>Request Appointment</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </PublicPageContainer>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  progressBar: { height: 3, backgroundColor: Colors.border.light },
  progressFill: { height: 3, backgroundColor: Colors.brand.primary },
  stepBody: { padding: 24 },
  stepHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 28,
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text.primary,
    backgroundColor: Colors.bg.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: Colors.status.danger,
    marginTop: 10,
    textAlign: 'center',
  },
  serviceList: { gap: 10 },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    gap: 12,
  },
  serviceRowSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primarySurface,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.brand.primaryDark,
    borderColor: Colors.brand.primaryDark,
  },
  svcInfo: { flex: 1 },
  svcName: { fontSize: 15, fontWeight: '600', color: Colors.text.primary },
  svcOriginalPrice: {
    fontSize: 12,
    color: Colors.text.muted,
    textDecorationLine: 'line-through',
  },
  svcPrice: { fontSize: 14, fontWeight: '700', color: Colors.text.primary },
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    gap: 12,
  },
  barberRowSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primarySurface,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: Colors.brand.primaryDark },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand.primaryDark,
  },
  barberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barberInitial: { fontSize: 16, fontWeight: '700', color: Colors.brand.primaryDark },
  barberName: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text.primary },
  availabilityLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  availabilityLoadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  dateTimeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    borderRadius: 12,
    backgroundColor: Colors.bg.surface,
  },
  dateTimeSelectorText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  dateTimePlaceholder: { color: Colors.text.muted, fontWeight: '400' },
  summaryCard: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
    width: 72,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
  },
  summaryValueBold: { fontWeight: '700', fontSize: 15 },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: '#ffffff',
  },
  nextBtn: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: { backgroundColor: Colors.text.primary },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  successIcon: { marginBottom: 8 },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneBtn: {
    marginTop: 16,
    backgroundColor: Colors.brand.primary,
    borderRadius: 999,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: Colors.text.primary },
});
