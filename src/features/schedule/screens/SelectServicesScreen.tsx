import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { ServiceCard } from "@/src/components/ServiceCard";
import {
  useNewBookingForm,
  SelectedService,
} from "@/src/features/schedule/context/NewBookingContext";
import { useScheduleServices } from "@/src/features/schedule/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { AppText } from "@/src/components/AppText";

export function SelectServicesScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { formData, setServices } = useNewBookingForm();
  const [query, setQuery] = useState("");

  const { data: services = [], isLoading } = useScheduleServices(
    query || undefined,
  );

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
        imageThumb: s.imageThumb,
      }));
    setServices(selectedServices);
    router.back();
  }

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <ScreenHeader
          title={t("schedule.selectServices")}
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.85}
              style={[styles.confirmBtn, Neu.accent()]}
            >
              <Ionicons
                name="checkmark"
                size={20}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          }
        />
      }
      contentStyle={styles.content}
    >
      <SearchInput value={query} onChangeText={setQuery} placeholder={t("common.search")} />

      {!isLoading && filtered.length === 0 ? (
        <AppText style={styles.emptyText}>{t("services.noServices")}</AppText>
      ) : (
        <View style={styles.list}>
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => toggleService(item.id)}
              style={styles.serviceWrapper}
            >
              <ServiceCard
                name={item.name}
                price={item.price}
                imageUri={item.imageThumb ?? undefined}
                discountPercent={item.discount > 0 ? item.discount : undefined}
                isDefault={item.isDefault}
              />
              <View
                style={[
                  styles.checkbox,
                  selected.has(item.id)
                    ? [styles.checkboxSelected, Neu.accent(0.75)]
                    : Neu.inset(Colors.bg.surface, 0.6),
                ]}
              >
                {selected.has(item.id) ? (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={Colors.text.primary}
                  />
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
    paddingTop: 24,
    gap: 16,
    paddingBottom: 200,
  },
  list: {
    gap: 12,
  },
  confirmBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.brand.primary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
