import { Permission } from "@/src/components/Permission";
import { Colors } from "@/src/theme/colors";
import { IconActionButton } from "@/src/features/barbershop/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { ServiceCard } from "@/src/components/ServiceCard";
import { SortMenu } from "@/src/components/SortMenu";
import { useMemberRole } from "@/src/hooks";
import {
  useServicesList,
  useToggleServiceActive,
} from "@/src/features/barbershop/hooks";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/src/components/AppText";

type SortOption =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "recent";

const SORT_OPTIONS = [
  { label: "Sort by Name (A-Z)", value: "name_asc" },
  { label: "Sort by Name (Z-A)", value: "name_desc" },
  { label: "Sort by Lowest Price", value: "price_asc" },
  { label: "Sort by Highest Price", value: "price_desc" },
  { label: "Recently Added", value: "recent" },
];

export function ServicesManagementScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { role } = useMemberRole();
  const canManage = role === "owner" || role === "admin";
  const [search, setSearch] = useState("");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("name_asc");

  const { data: services = [], isLoading } = useServicesList({
    search: search || undefined,
    sort: selectedSort,
  });
  const { mutate: toggleActive } = useToggleServiceActive();

  const handleToggle = (id: string) => {
    toggleActive(id, {
      onError: (e) => toast.error(e.message || t("toast.unknownError")),
    });
  };

  return (
    <ScreenShell hideAppHeader
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
                <Ionicons
                  name="filter-outline"
                  size={18}
                  color={Colors.text.primary}
                />
              </TouchableOpacity>
              <Permission roles={["owner", "admin"]}>
                <IconActionButton
                  iconName="add"
                  onPress={() => router.push("/d/add-or-edit-service")}
                  size={36}
                />
              </Permission>
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
              onSelect={(v) => setSelectedSort(v as SortOption)}
              onClose={() => setSortMenuVisible(false)}
              options={SORT_OPTIONS}
            />
          </View>
        ) : null
      }
    >
      <AppText style={styles.title}>{t("services.management")}</AppText>
      <AppText style={styles.subtitle}>{t("services.management")}</AppText>

      <SearchInput
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {!isLoading && services.length === 0 ? (
        <AppText style={styles.empty}>
          {search
            ? t("common.noData")
            : t("services.noServices")}
        </AppText>
      ) : null}
      {services.length > 0 ? (
        <View style={styles.list}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              onPress={() =>
                router.push({
                  pathname: "/d/service-detail",
                  params: { serviceId: service.id },
                })
              }
              activeOpacity={0.85}
            >
              <ServiceCard
                name={service.name}
                price={service.price}
                discountPercent={
                  service.discount > 0 ? service.discount : undefined
                }
                isDefault={service.isDefault}
                isActive={service.isActive}
                onToggleActive={
                  canManage ? () => handleToggle(service.id) : undefined
                }
                style={
                  index < services.length - 1 ? styles.cardMargin : undefined
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 24,
  },
  search: {
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 40,
  },
  list: {},
  cardMargin: {
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg.default,
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
