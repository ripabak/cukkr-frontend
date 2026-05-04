import { IconActionButton } from "@/src/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { ServiceCard } from "@/src/components/ServiceCard";
import { SortMenu } from "@/src/components/SortMenu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Service {
  id: string;
  name: string;
  price: number;
  discountPercent?: number;
  isDefault?: boolean;
  isActive: boolean;
}

const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Classic Haircut",
    price: 50000,
    isDefault: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Fade Cut",
    price: 75000,
    discountPercent: 20,
    isActive: true,
  },
  { id: "3", name: "Beard Trim", price: 35000, isActive: false },
  { id: "4", name: "Hair Coloring", price: 150000, isActive: true },
];

const MOCK_SORT_OPTIONS = [
  { label: "Sort by Name", value: "name" },
  { label: "Sort by Lowest", value: "lowest" },
  { label: "Sort by Highest", value: "highest" },
  { label: "Sort by Recently Added", value: "recent" },
  { label: "Sort by Oldest First", value: "oldest" },
];

export function ServicesManagementScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("name");
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleActive = (id: string, value: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: value } : s)),
    );
  };

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => setSortMenuVisible(true)}
                activeOpacity={0.7}
                style={styles.headerIcon}
              >
                <Ionicons name="filter-outline" size={18} color="#1A1A1A" />
              </TouchableOpacity>
              <IconActionButton
                iconName="add"
                onPress={() => router.push("/add-or-edit-service")}
                size={36}
              />
            </View>
          }
        />
      }
      overlaySlot={
        sortMenuVisible ? (
          <View style={styles.menuOverlay}>
            <SortMenu
              visible
              selected={selectedSort}
              onSelect={setSelectedSort}
              onClose={() => setSortMenuVisible(false)}
              options={MOCK_SORT_OPTIONS}
            />
          </View>
        ) : null
      }
    >
      <Text style={styles.title}>Services Management</Text>
      <Text style={styles.subtitle}>Manage your barbershop services</Text>

      <SearchInput
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.list}>
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            name={service.name}
            price={service.price}
            discountPercent={service.discountPercent}
            isDefault={service.isDefault}
            isActive={service.isActive}
            onToggleActive={(v) => handleToggleActive(service.id, v)}
            style={
              index < filteredServices.length - 1
                ? styles.cardMargin
                : undefined
            }
          />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    marginBottom: 16,
  },
  search: {
    marginBottom: 16,
  },
  list: {},
  cardMargin: {
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E0DDD0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});
