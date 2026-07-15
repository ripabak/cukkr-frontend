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
import { AppText } from "@/src/components/AppText";

export function SelectBarberScreen() {
  const router = useRouter();
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
      headerSlot={
        <ScreenHeader title="Select Barber" onBack={() => router.back()} />
      }
      contentStyle={styles.content}
    >
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search" />

      {!isLoading && filtered.length === 0 ? (
        <AppText style={styles.emptyText}>No barbers found.</AppText>
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
    paddingTop: 16,
    gap: 16,
    paddingBottom: 40,
  },
  list: {
    gap: 10,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
