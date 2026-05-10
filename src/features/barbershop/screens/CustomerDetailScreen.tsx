import { Colors } from '@/src/theme/colors';
import AppTheme from "@/src/app-theme";
import { BookingCard } from "@/src/components/BookingCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { SCHEDULE_STATUS_OPTIONS, StatusFilterMenu } from "@/src/components/StatusFilterMenu";
import { ChartCard } from "@/src/features/barbershop/components/ChartCard";
import { IconActionButton } from "@/src/features/barbershop/components/IconActionButton";
import { MessageItem, MessageThread } from "@/src/features/barbershop/components/MessageThread";
import { SegmentedTabs } from "@/src/features/barbershop/components/SegmentedTabs";
import { StatCard } from "@/src/features/barbershop/components/StatCard";
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

  const getBookingRoute = (status: string) => {
    if (status === "waiting") return "/booking-detail-waiting";
    if (status === "in_progress") return "/booking-detail-in-progress";
    if (status === "completed" || status === "cancelled") return "/booking-detail-result";
    return "/booking-detail-request";
  };

  if (isLoadingCustomer) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ActivityIndicator size="large" color={Colors.brand.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader
          title="Customer Details"
          onBack={() => router.back()}
          rightAction={
            <IconActionButton
              iconName="send"
              size={36}
              onPress={() =>
                router.push({
                  pathname: "/send-messages-to-customers",
                  params: { recipientName: customer?.name, count: "1" },
                })
              }
            />
          }
        />

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
                  iconColor={Colors.brand.primary}
                  style={styles.statCard}
                />
                <StatCard
                  label="Appoint."
                  value={String(customer.appointmentCount)}
                  iconName="calendar"
                  iconColor={Colors.brand.primary}
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
                  <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>
              {isLoadingBookings ? (
                <ActivityIndicator size="small" color={Colors.brand.primary} />
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
                      onPress={() =>
                        router.push({
                          pathname: getBookingRoute(b.status),
                          params: { id: b.id },
                        })
                      }
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
  safe: { flex: 1, backgroundColor: Colors.bg.default, paddingTop: AppTheme.spacing.lg },
  container: { flex: 1, backgroundColor: Colors.bg.default },
  loader: { marginTop: 80 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  customerName: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text.primary,
    marginTop: 8,
  },
  customerPhone: { fontSize: 14, color: Colors.text.secondary, marginTop: 4, marginBottom: 16 },
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
  bookingTitle: { fontSize: 20, fontWeight: "700", color: Colors.text.primary },
  bookingCount: { color: Colors.icon.muted, fontWeight: "500" },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.bg.default,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.primary,
    textTransform: "capitalize",
  },
  bookingList: { gap: 10 },
  statusMenu: { top: 36, right: 0 },
  noMessages: { fontSize: 14, color: Colors.text.secondary, textAlign: "center", marginTop: 24 },
});
