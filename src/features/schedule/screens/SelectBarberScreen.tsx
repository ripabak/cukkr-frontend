import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useScheduleBarbers } from "@/src/features/schedule/hooks";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { AppText } from "@/src/components/AppText";

export function SelectBarberScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { setBarber } = useNewBookingForm();
  const [query, setQuery] = useState("");

  const { data: barbers = [], isLoading } = useScheduleBarbers(
    query || undefined,
  );

  const filtered = barbers.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (id: string, name: string) => {
    setBarber(id, name);
    router.back();
  };

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <ScreenHeader title={t("schedule.selectBarber")} onBack={() => router.back()} />
      }
      contentStyle={styles.content}
    >
      <SearchInput value={query} onChangeText={setQuery} placeholder={t("common.search")} />

      {!isLoading && filtered.length === 0 ? (
        <AppText style={styles.emptyText}>{t("barbers.noBarbers")}</AppText>
      ) : (
        <View style={styles.list}>
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={styles.barberRow}
              onPress={() => handleSelect(item.id, item.name)}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color={Colors.text.primary} />
              </View>
              <AppText style={styles.barberName}>{item.name}</AppText>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.text.primary}
              />
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
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  barberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
