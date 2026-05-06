import { BookingCard } from "@/src/components/BookingCard";
import { ChartCard } from "@/src/components/ChartCard";
import { MessageItem, MessageThread } from "@/src/components/MessageThread";
import { SegmentedTabs } from "@/src/components/SegmentedTabs";
import { StatCard } from "@/src/components/StatCard";
import { SCHEDULE_STATUS_OPTIONS, StatusFilterMenu } from "@/src/components/StatusFilterMenu";
import {
  useCustomerBookings,
  useCustomerById,
} from "@/src/features/barbershop/hooks";
import { formatCurrency } from "@/src/features/barbershop/utils/form-validators";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DETAIL_TABS = [
  { key: "general", label: "General" },
  { key: "books", label: "Books" },
  { key: "messages", label: "Messages" },
];

const EMPTY_MESSAGES: MessageItem[] = [];

interface Props {
  defaultTab?: "general" | "books" | "messages";
}

export function CustomerDetailScreen({ defaultTab = "general" }: Props) {
  const router = useRouter();
  const { customerId = "" } = useLocalSearchParams<{ customerId?: string }>();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [filterVisible, setFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: customer, isLoading: isLoadingCustomer } = useCustomerById(customerId);
  const { data: bookings = [], isLoading: isLoadingBookings } = useCustomerBookings(customerId);

  const filteredBookings = (bookings as Array<{ id: string; referenceNumber: string; status: string; createdAt: Date; totalAmount: number }>).filter(
    (b) => statusFilter === "all" || b.status === statusFilter,
  );

  if (isLoadingCustomer) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ActivityIndicator size="large" color="#C6FF4D" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Details</Text>
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() =>
              router.push({
                pathname: "/send-messages-to-customers",
                params: { recipientName: customer?.name, count: "1" },
              })
            }
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.customerName}>{customer?.name ?? "—"}</Text>
          <Text style={styles.customerPhone}>
            {customer?.phone ?? customer?.email ?? "No contact"}
            {customer?.isVerified ? " (verified)" : ""}
          </Text>

          <SegmentedTabs
            tabs={DETAIL_TABS}
            activeKey={activeTab}
            onTabPress={setActiveTab}
            style={styles.tabs}
          />

          {activeTab === "general" && customer && (
            <View style={styles.tabContent}>
              <View style={styles.statRow}>
                <StatCard
                  label="Book Value"
                  value={formatCurrency(customer.totalSpend)}
                  style={styles.statCard}
                />
                <StatCard
                  label="Books"
                  value={String(customer.totalBookings)}
                  style={styles.statCard}
                />
              </View>
              <View style={styles.statRow}>
                <StatCard
                  label="Walk-In"
                  value={String(customer.walkInCount)}
                  iconName="people"
                  iconColor="#C6ED3C"
                  style={styles.statCard}
                />
                <StatCard
                  label="Appoint."
                  value={String(customer.appointmentCount)}
                  iconName="calendar"
                  iconColor="#C6ED3C"
                  style={styles.statCard}
                />
              </View>
              <ChartCard
                title="Book Stats"
                subtitle={`${customer.completedCount} completed · ${customer.cancelledCount} cancelled`}
                style={styles.chartCard}
              />
            </View>
          )}

          {activeTab === "books" && (
            <View style={styles.tabContent}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingTitle}>
                  Booking{" "}
                  <Text style={styles.bookingCount}>({bookings.length})</Text>
                </Text>
                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => setFilterVisible(true)}
                >
                  <Text style={styles.filterBtnText}>
                    {statusFilter === "all" ? "All" : statusFilter}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
              {isLoadingBookings ? (
                <ActivityIndicator size="small" color="#C6FF4D" />
              ) : (
                <View style={styles.bookingList}>
                  {filteredBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      customerName={b.referenceNumber}
                      barberName={customer?.name ?? ""}
                      timeLabel={new Date(b.createdAt).toLocaleDateString("id-ID")}
                      duration={formatCurrency(b.totalAmount)}
                      status={b.status as "waiting" | "in_progress" | "completed" | "cancelled" | "requested"}
                    />
                  ))}
                </View>
              )}
              <StatusFilterMenu
                visible={filterVisible}
                options={SCHEDULE_STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(s) => {
                  setStatusFilter(s);
                  setFilterVisible(false);
                }}
                onClose={() => setFilterVisible(false)}
                style={styles.statusMenu}
              />
            </View>
          )}

          {activeTab === "messages" && (
            <View style={styles.tabContent}>
              <MessageThread messages={EMPTY_MESSAGES} />
              <Text style={styles.noMessages}>No messages sent yet.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F4E8" },
  container: { flex: 1, backgroundColor: "#F5F4E8" },
  loader: { marginTop: 80 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  customerName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 8,
  },
  customerPhone: { fontSize: 14, color: "#555555", marginTop: 4, marginBottom: 16 },
  tabs: { marginBottom: 20 },
  tabContent: { gap: 12 },
  statRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1 },
  chartCard: {},
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bookingTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  bookingCount: { color: "#888888", fontWeight: "500" },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
    textTransform: "capitalize",
  },
  bookingList: { gap: 10 },
  statusMenu: { top: 36, right: 0 },
  noMessages: { fontSize: 14, color: "#666666", textAlign: "center", marginTop: 24 },
});
