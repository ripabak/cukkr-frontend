import { CustomerCard } from "@/src/features/barbershop/components/CustomerCard";
import { FloatingActionButton } from "@/src/features/barbershop/components/FloatingActionButton";
import { SearchInput } from "@/src/components/SearchInput";
import { SelectionFooter } from "@/src/features/barbershop/components/SelectionFooter";
import { SelectionToolbar } from "@/src/features/barbershop/components/SelectionToolbar";
import { SortMenu } from "@/src/components/SortMenu";
import { useCustomersList } from "@/src/features/barbershop/hooks";
import { formatCurrency } from "@/src/features/barbershop/utils/form-validators";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomerSort = "name_asc" | "recent" | "bookings_desc" | "spend_desc";

const SORT_OPTIONS = [
  { label: "Sort by Name", value: "name_asc" },
  { label: "Sort by Total Bookings", value: "bookings_desc" },
  { label: "Sort by Spend", value: "spend_desc" },
  { label: "Recently Added", value: "recent" },
];

export function CustomerManagementScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortVisible, setSortVisible] = useState(false);
  const [sortValue, setSortValue] = useState<CustomerSort>("name_asc");

  const { data: customers = [], isLoading } = useCustomersList({
    search: search || undefined,
    sort: sortValue,
  });

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCardPress(customerId: string) {
    if (selectionMode) {
      toggleSelect(customerId);
    } else {
      router.push({
        pathname: "/customer-detail-general",
        params: { customerId },
      });
    }
  }

  function handleCancelSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  const bgColor = selectionMode ? "#C6ED3C" : "#F5F4E8";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <SelectionToolbar
          selectionMode={selectionMode}
          onToggleSelect={() => {
            if (selectionMode) handleCancelSelection();
            else setSelectionMode(true);
          }}
          onFilterPress={() => setSortVisible(true)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Customer{"\n"}Management</Text>
          <Text style={styles.subtitle}>Manage all your customers in one place.</Text>
          {!selectionMode && (
            <Text style={styles.hint}>
              Only customers with valid contact information will appear here.
            </Text>
          )}

          <View style={styles.searchWrapper}>
            <SearchInput value={search} onChangeText={setSearch} placeholder="Search" />
          </View>

          {!isLoading && customers.length === 0 ? (
            <Text style={styles.empty}>
              {search ? "No customers match your search." : "No customers yet."}
            </Text>
          ) : null}
          {customers.length > 0 ? (
            <View style={styles.list}>
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  name={customer.name}
                  totalBook={customer.totalBookings}
                  bookValue={formatCurrency(customer.totalSpend)}
                  selectionMode={selectionMode}
                  selected={selectedIds.has(customer.id)}
                  onPress={() => handleCardPress(customer.id)}
                />
              ))}
            </View>
          ) : null}

          {selectionMode && <View style={{ height: 80 }} />}
        </ScrollView>

        {selectionMode && (
          <>
            <SelectionFooter count={selectedIds.size} />
            <FloatingActionButton
              onPress={() =>
                router.push({
                  pathname: "/send-messages-to-customers",
                  params: { count: selectedIds.size },
                })
              }
            />
          </>
        )}

        <SortMenu
          visible={sortVisible}
          options={SORT_OPTIONS}
          selected={sortValue}
          onSelect={(v) => setSortValue(v as CustomerSort)}
          onClose={() => setSortVisible(false)}
          style={styles.sortMenu}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1A1A1A",
    lineHeight: 40,
    marginTop: 8,
  },
  subtitle: { fontSize: 14, color: "#444444", marginTop: 8 },
  hint: { fontSize: 14, color: "#444444", marginTop: 4 },
  searchWrapper: { marginTop: 24, marginBottom: 16 },
  empty: { fontSize: 14, color: "#666666", textAlign: "center", marginTop: 40 },
  list: { gap: 10 },
  sortMenu: { top: 52, right: 20, left: 20 },
});
