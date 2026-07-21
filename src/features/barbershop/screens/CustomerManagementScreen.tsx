import { Colors } from "@/src/theme/colors";
import { CustomerCard } from "@/src/features/barbershop/components/CustomerCard";
import { FloatingActionButton } from "@/src/features/barbershop/components/FloatingActionButton";
import { SearchInput } from "@/src/components/SearchInput";
import { SelectionFooter } from "@/src/features/barbershop/components/SelectionFooter";
import { SelectionToolbar } from "@/src/features/barbershop/components/SelectionToolbar";
import { FilterPicker } from "@/src/components/FilterPicker";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useCustomersList } from "@/src/features/barbershop/hooks";
import { formatCurrency } from "@/src/features/barbershop/utils/form-validators";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";

type CustomerSort = "name_asc" | "recent" | "bookings_desc" | "spend_desc";

function getSortOptions(t: (key: string) => string) {
  return [
    { label: t("customers.sortByName"), value: "name_asc" },
    { label: t("customers.sortByTotalBookings"), value: "bookings_desc" },
    { label: t("customers.sortBySpend"), value: "spend_desc" },
    { label: t("customers.recentlyAdded"), value: "recent" },
  ];
}

export function CustomerManagementScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortValue, setSortValue] = useState<CustomerSort>("name_asc");
  const [hasContact, setHasContact] = useState(true);

  const { data: customers = [], isLoading } = useCustomersList({
    search: search || undefined,
    sort: sortValue,
    hasContact,
  });

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allSelectedVerified =
    selectedIds.size > 0 &&
    customers
      .filter((c) => selectedIds.has(c.id))
      .every((c) => c.emailVerified || c.phoneVerified);

  function handleCardPress(customerId: string, customerHasContact: boolean) {
    if (selectionMode) {
      if (customerHasContact) {
        toggleSelect(customerId);
      }
    } else {
      router.push({
        pathname: "/d/customer-detail-general",
        params: { customerId },
      });
    }
  }

  function handleCancelSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  const bgColor = selectionMode ? Colors.brand.primary : Colors.bg.default;

  return (
    <ScreenShell
      backgroundColor={bgColor}
      hideAppHeader
      headerSlot={
        <SelectionToolbar
          selectionMode={selectionMode}
          onToggleSelect={() => {
            if (selectionMode) handleCancelSelection();
            else setSelectionMode(true);
          }}
          filterSlot={
            <FilterPicker
              options={getSortOptions(t)}
              selected={sortValue}
              onSelect={(v) => setSortValue(v as CustomerSort)}
              renderTrigger={({ onPress }) => (
                <TouchableOpacity
                  style={toolbarStyles.filterBtn}
                  onPress={onPress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="filter" size={18} color={Colors.text.primary} />
                </TouchableOpacity>
              )}
            />
          }
          hasContact={hasContact}
          onContactFilterPress={() => setHasContact((prev) => !prev)}
        />
      }
      footerSlot={
        selectionMode ? (
          <>
            <SelectionFooter count={selectedIds.size} />
            <FloatingActionButton
              onPress={
                allSelectedVerified
                  ? () =>
                      router.push({
                        pathname: "/d/send-messages-to-customers",
                        params: { count: selectedIds.size },
                      })
                  : undefined
              }
              style={!allSelectedVerified && selectedIds.size > 0 ? { opacity: 0.4 } : undefined}
            />
          </>
        ) : null
      }
      contentStyle={styles.content}
    >
      <AppText style={styles.title}>{t("customers.title")}</AppText>
      <AppText style={styles.subtitle}>
        {t("customers.noCustomers")}
      </AppText>
      {!selectionMode && (
        <AppText style={styles.hint}>
          {hasContact
            ? t("customers.onlyWithContact")
            : t("customers.showingAll")}
        </AppText>
      )}

      <View style={styles.searchWrapper}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("customers.searchPlaceholder")}
        />
      </View>

      {!isLoading && customers.length === 0 ? (
        <AppText style={styles.empty}>
          {search ? t("common.noData") : t("customers.noCustomers")}
        </AppText>
      ) : null}

      {customers.length > 0 ? (
        <View style={styles.list}>
          {customers.map((customer) => {
            const customerHasContact = !!(
              customer.emailVerified || customer.phoneVerified
            );
            return (
              <CustomerCard
                key={customer.id}
                name={customer.name}
                totalBook={customer.totalBookings}
                bookValue={formatCurrency(customer.totalSpend)}
                hasContact={customerHasContact}
                selectionMode={selectionMode}
                selected={selectedIds.has(customer.id)}
                onPress={() => handleCardPress(customer.id, customerHasContact)}
              />
            );
          })}
        </View>
      ) : null}

      {selectionMode && <View style={{ height: 80 }} />}
    </ScreenShell>
  );
}

const toolbarStyles = StyleSheet.create({
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  content: { paddingBottom: 200 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
    lineHeight: 38,
    letterSpacing: -0.8,
    marginTop: 8,
  },
  subtitle: { fontSize: 14, color: Colors.text.secondary, marginTop: 8 },
  hint: { fontSize: 14, color: Colors.text.secondary, marginTop: 4 },
  searchWrapper: { marginTop: 24, marginBottom: 16 },
  empty: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 40,
  },
  list: { gap: 12 },
});
