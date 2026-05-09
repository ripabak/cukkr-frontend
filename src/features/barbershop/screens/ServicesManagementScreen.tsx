import { IconActionButton } from "@/src/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { ServiceCard } from "@/src/components/ServiceCard";
import { SortMenu } from "@/src/components/SortMenu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
            <View className="flex-row items-center gap-sm">
              <TouchableOpacity
                onPress={() => setSortMenuVisible(true)}
                activeOpacity={0.7}
                className="w-9 h-9 rounded-[18px] border border-border items-center justify-center bg-card"
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
          <View className="absolute inset-0 z-50">
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
      <Text className="text-[28px] font-bold text-dark mt-sm">Services Management</Text>
      <Text className="text-[14px] text-gray mt-[4px] mb-lg">Manage your barbershop services</Text>

      <SearchInput
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 16 }}
      />

      <View>
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
                ? { marginBottom: 12 }
                : undefined
            }
          />
        ))}
      </View>
    </ScreenShell>
  );
}
