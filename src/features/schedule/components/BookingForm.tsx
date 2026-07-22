import React from "react";
import { Image, View, StyleSheet, ViewStyle } from "react-native";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { TextInputField } from "@/src/components/TextInputField";
import { SelectorInput } from "@/src/features/schedule/components/SelectorInput";
import { ServiceSelectionCard } from "@/src/features/schedule/components/ServiceSelectionCard";

interface ServiceItem {
  name: string;
  price: number;
  isDefault?: boolean;
  imageThumb?: string | null;
}

interface Props {
  customerName: string;
  onCustomerNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  emailRequired?: boolean;
  selectedBarber?: string;
  selectedBarberAvatarUrl?: string | null;
  onBarberPress?: () => void;
  selectedDateTime?: string;
  onDateTimePress?: () => void;
  showDateTimeSelector?: boolean;
  services: ServiceItem[];
  onServicePress?: () => void;
  style?: ViewStyle;
}

export function BookingForm({
  customerName,
  onCustomerNameChange,
  email,
  onEmailChange,
  emailRequired = false,
  selectedBarber,
  selectedBarberAvatarUrl,
  onBarberPress,
  selectedDateTime,
  onDateTimePress,
  showDateTimeSelector = true,
  services,
  onServicePress,
  style,
}: Props) {
  const { t } = useI18nContext();
  return (
    <View style={[styles.container, style]}>
      <TextInputField
        label={t("schedule.bookingForm.customerName")}
        required
        value={customerName}
        onChangeText={onCustomerNameChange}
        placeholder={t("schedule.bookingForm.customerName")}
      />
      <TextInputField
        label={emailRequired ? t("schedule.bookingForm.email") : t("schedule.bookingForm.emailOptional")}
        required={emailRequired}
        value={email}
        onChangeText={onEmailChange}
        placeholder={t("schedule.bookingForm.email")}
        keyboardType="email-address"
      />
      <SelectorInput
        label={t("schedule.bookingForm.barber")}
        placeholder={t("schedule.bookingForm.selectBarber")}
        value={selectedBarber}
        iconName={selectedBarberAvatarUrl ? undefined : "person-outline"}
        leftElement={selectedBarberAvatarUrl ? <Image source={{ uri: selectedBarberAvatarUrl }} style={styles.barberAvatar} /> : undefined}
        onPress={onBarberPress}
      />
      {showDateTimeSelector ? (
        <SelectorInput
          label={t("schedule.bookingForm.dateTime")}
          required
          placeholder={t("schedule.bookingForm.selectDateTime")}
          value={selectedDateTime}
          iconName="calendar-outline"
          onPress={onDateTimePress}
        />
      ) : null}
      <ServiceSelectionCard
        required
        services={services}
        onSelectPress={onServicePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  barberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    resizeMode: "cover",
  },
});
