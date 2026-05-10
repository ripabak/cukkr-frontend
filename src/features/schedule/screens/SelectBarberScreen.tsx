import { Colors } from '@/src/theme/colors';
import AppTheme from "@/src/app-theme";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { SearchInput } from "@/src/components/SearchInput";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useScheduleBarbers } from "@/src/features/schedule/hooks";

export function SelectBarberScreen() {
  const router = useRouter();
  const { setBarber } = useNewBookingForm();
  const [query, setQuery] = useState("");

  const { data: barbers = [], isLoading } = useScheduleBarbers(query || undefined);

  const filtered = barbers.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (id: string, name: string) => {
    setBarber(id, name);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Select Barber" onBack={() => router.back()} />
      <View style={styles.content}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search" />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.barberRow}
              onPress={() => handleSelect(item.id, item.name)}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color={Colors.text.primary} />
              </View>
              <Text style={styles.barberName}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.text.primary} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={styles.emptyText}>No barbers found.</Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    paddingTop: AppTheme.spacing.lg,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
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
  separator: {
    height: 0,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
