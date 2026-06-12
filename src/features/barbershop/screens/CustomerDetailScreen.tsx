import { Colors } from "@/src/theme/colors";
import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  SCHEDULE_STATUS_OPTIONS,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { ChartCard } from "@/src/features/barbershop/components/ChartCard";
import { IconActionButton } from "@/src/features/barbershop/components/IconActionButton";
import {
  MessageItem,
  MessageThread,
} from "@/src/features/barbershop/components/MessageThread";
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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BookingStatus =
  | "all"
  | "pending"
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

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
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("all");

  const { data: customer, isLoading: isLoadingCustomer } =
    useCustomerById(customerId);
  const { data: bookings = [], isLoading: isLoadingBookings } =
    useCustomerBookings(customerId, { status: statusFilter });

  if (isLoadingCustomer) {
    return (
      <ScreenShell>
        <ActivityIndicator
          size="large"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell contentStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.topBarSpacer} />
        <IconActionButton
          iconName="send"
          size={36}
          onPress={() =>
            router.push({
              pathname: "/d/send-messages-to-customers",
              params: { recipientName: customer?.name, count: "1" },
            })
          }
        />
      </View>

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
              style={styles.filterPill}
              onPress={() => setFilterVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.filterLabel}>
                {SCHEDULE_STATUS_OPTIONS.find((o) => o.value === statusFilter)
                  ?.label ?? "All"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          {isLoadingBookings ? (
            <ActivityIndicator size="small" color={Colors.brand.primary} />
          ) : (
            <View style={styles.bookingList}>
              {bookings.map((b: { id: string; referenceNumber: string; status: string; createdAt: Date; totalAmount: number }) => (
                <BookingCard
                  key={b.id}
                  customerName={b.referenceNumber}
                  barberName={customer?.name ?? ""}
                  timeLabel={new Date(b.createdAt as Date).toLocaleDateString(
                    "id-ID",
                  )}
                  duration={formatCurrency(b.totalAmount)}
                  status={
                    b.status as
                      | "waiting"
                      | "in_progress"
                      | "completed"
                      | "cancelled"
                      | "requested"
                  }
                  onPress={() =>
                    router.push({
                      pathname: "/d/booking-detail",
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
              setStatusFilter(s as BookingStatus);
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 80 },
  content: { paddingBottom: 40 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  topBarSpacer: { flex: 1 },
  customerName: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text.primary,
    marginTop: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 16,
  },
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
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  bookingList: { gap: 10 },
  statusMenu: { top: 36, right: 0 },
  noMessages: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 24,
  },
});
