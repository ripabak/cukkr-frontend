import { Colors } from '@/src/theme/colors';
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { ServiceCard } from "@/src/components/ServiceCard";
import { useNewBookingForm, SelectedService } from "@/src/features/schedule/context/NewBookingContext";
import { useScheduleServices } from "@/src/features/schedule/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function SelectServicesScreen() {
  const router = useRouter();
  const { formData, setServices } = useNewBookingForm();
  const [query, setQuery] = useState("");

  const { data: services = [], isLoading } = useScheduleServices(query || undefined);

  const [selected, setSelected] = useState<Set<string>>(
    new Set(formData.serviceIds),
  );

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    const selectedServices: SelectedService[] = services
      .filter((s) => selected.has(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        isDefault: s.isDefault,
      }));
    setServices(selectedServices);
    router.back();
  }

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader
          title="Select Services"
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              style={styles.confirmBtn}
            >
              <Ionicons name="checkmark" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          }
        />
      }
      contentStyle={styles.content}
    >
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search" />

      {!isLoading && filtered.length === 0 ? (
        <Text style={styles.emptyText}>No services found.</Text>
      ) : (
        <View style={styles.list}>
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggleService(item.id)}
              style={styles.serviceWrapper}
            >
              <ServiceCard
                name={item.name}
                price={item.price}
                discountPercent={item.discount > 0 ? item.discount : undefined}
                isDefault={item.isDefault}
              />
              <View style={[styles.checkbox, selected.has(item.id) && styles.checkboxSelected]}>
                {selected.has(item.id) ? (
                  <Ionicons name="checkmark" size={14} color={Colors.text.primary} />
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    gap: 16,
    paddingBottom: 40,
  },
  list: {
    gap: 10,
  },
  confirmBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceWrapper: {
    position: "relative",
  },
  checkbox: {
    position: "absolute",
    right: 14,
    top: "50%",
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.border.default,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
