import { Permission } from "@/src/components/Permission";
import { IconActionButton } from "@/src/features/barbershop/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { FilterPicker } from "@/src/components/FilterPicker";
import { ServiceCard } from "@/src/components/ServiceCard";
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
import { Skeleton } from "@/src/components/Skeleton";
import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";

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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { role } = useMemberRole();
  const canManage = role === "owner" || role === "admin";
  const [search, setSearch] = useState("");
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
    <ScreenShell
      headerSlot={
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <View style={styles.headerActions}>
              <FilterPicker
                options={SORT_OPTIONS}
                selected={selectedSort}
                onSelect={(v) => setSelectedSort(v as SortOption)}
                renderTrigger={({ onPress }) => (
                  <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.85}
                    style={[styles.headerIcon, Neu.soft(colors.bg.surface)]}
                  >
                    <Ionicons
                      name="filter-outline"
                      size={18}
                      color={colors.text.primary}
                    />
                  </TouchableOpacity>
                )}
              />
              <Permission roles={["owner", "admin"]}>
                <IconActionButton
                  iconName="add"
                  onPress={() => router.push("/d/add-or-edit-service")}
                  size={40}
                />
              </Permission>
            </View>
          }
        />
      }
    >
      <AppText style={styles.title}>{t("services.management")}</AppText>
      <AppText style={styles.subtitle}>{t("services.managementSubtitle")}</AppText>

      <SearchInput
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {isLoading ? (
        <View style={styles.list}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton.Card
              key={i}
              thumb={56}
              height={84}
              radius={20}
              style={i < 4 ? styles.cardMargin : undefined}
            />
          ))}
        </View>
      ) : null}

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
                imageUri={service.imageThumb ?? undefined}
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

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: "600",
      color: c.text.primary,
      marginTop: 8,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: 14,
      color: c.text.secondary,
      marginTop: 4,
      marginBottom: 24,
    },
    search: {
      marginBottom: 16,
    },
    empty: {
      fontSize: 14,
      color: c.text.secondary,
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
      alignItems: "center",
      justifyContent: "center",
    },
  });
