import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { TextInputField } from "@/src/components/TextInputField";
import { SelectorInput } from "@/src/features/schedule/components/SelectorInput";
import { ServiceSelectionCard } from "@/src/features/schedule/components/ServiceSelectionCard";

interface ServiceItem {
  name: string;
  price: number;
  isDefault?: boolean;
}

interface Props {
  customerName: string;
  onCustomerNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  emailRequired?: boolean;
  selectedBarber?: string;
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
  onBarberPress,
  selectedDateTime,
  onDateTimePress,
  showDateTimeSelector = true,
  services,
  onServicePress,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TextInputField
        label="Customer Name"
        required
        value={customerName}
        onChangeText={onCustomerNameChange}
        placeholder="Customer Name"
      />
      <TextInputField
        label={`Email${emailRequired ? '' : ' (Optional)'}`}
        required={emailRequired}
        value={email}
        onChangeText={onEmailChange}
        placeholder="email"
        keyboardType="email-address"
      />
      <SelectorInput
        label="Barber"
        placeholder="Select preferred barber"
        value={selectedBarber}
        iconName="person-outline"
        onPress={onBarberPress}
      />
      {showDateTimeSelector ? (
        <SelectorInput
          label="Date & Time"
          required
          placeholder="Select your date and time"
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
});
