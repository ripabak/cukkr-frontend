import { Colors } from "@/src/theme/colors";
import { CustomerCard } from "@/src/features/barbershop/components/CustomerCard";
import { FloatingActionButton } from "@/src/features/barbershop/components/FloatingActionButton";
import { SearchInput } from "@/src/components/SearchInput";
import { SelectionFooter } from "@/src/features/barbershop/components/SelectionFooter";
import { SelectionToolbar } from "@/src/features/barbershop/components/SelectionToolbar";
import { SortMenu } from "@/src/components/SortMenu";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useCustomersList } from "@/src/features/barbershop/hooks";
import { formatCurrency } from "@/src/features/barbershop/utils/form-validators";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

type CustomerSort = "name_asc" | "recent" | "bookings_desc" | "spend_desc";

const SORT_OPTIONS = [
  { label: "Sort by Name", value: "name_asc" },
  { label: "Sort by Total Bookings", value: "bookings_desc" },
  { label: "Sort by Spend", value: "spend_desc" },
  { label: "Recently Added", value: "recent" },
];

export function CustomerManagementScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortVisible, setSortVisible] = useState(false);
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
          onFilterPress={() => setSortVisible(true)}
          hasContact={hasContact}
          onContactFilterPress={() => setHasContact((prev) => !prev)}
        />
      }
      footerSlot={
        selectionMode ? (
          <>
            <SelectionFooter count={selectedIds.size} />
            <FloatingActionButton
              onPress={() =>
                router.push({
                  pathname: "/d/send-messages-to-customers",
                  params: { count: selectedIds.size },
                })
              }
            />
          </>
        ) : null
      }
      overlaySlot={
        <SortMenu
          visible={sortVisible}
          options={SORT_OPTIONS}
          selected={sortValue}
          onSelect={(v) => setSortValue(v as CustomerSort)}
          onClose={() => setSortVisible(false)}
          style={styles.sortMenu}
        />
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
            ? "Only customers with valid contact information will appear here."
            : "Showing all customers including those without contact info."}
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
              customer.email || customer.phone
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
  sortMenu: { top: 100, right: 20, left: 20 },
});
