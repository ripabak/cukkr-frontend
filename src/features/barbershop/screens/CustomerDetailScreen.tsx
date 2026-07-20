import { Colors } from "@/src/theme/colors";
import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  getScheduleStatusOptions,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { CustomerBookingChart } from "@/src/features/barbershop/components/CustomerBookingChart";
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
  useCustomerChart,
} from "@/src/features/barbershop/hooks";
import { formatCurrency } from "@/src/features/barbershop/utils/form-validators";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type BookingStatus =
  | "all"
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

function getDetailTabs(t: (key: string) => string) {
  return [
    { key: "general", label: t("customers.general") },
    { key: "books", label: t("customers.books") },
    { key: "messages", label: t("customers.messages") },
  ];
}


const EMPTY_MESSAGES: MessageItem[] = [];

interface Props {
  defaultTab?: "general" | "books" | "messages";
}

export function CustomerDetailScreen({ defaultTab = "general" }: Props) {
  const router = useRouter();
  const { t } = useI18nContext();
  const { customerId = "" } = useLocalSearchParams<{ customerId?: string }>();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [filterVisible, setFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("all");

  const { data: customer, isLoading: isLoadingCustomer } =
    useCustomerById(customerId);
  const { data: bookings = [], isLoading: isLoadingBookings } =
    useCustomerBookings(customerId, { status: statusFilter });
  const { data: chartData = [] } = useCustomerChart(customerId);

  const isVerified = !!(customer?.emailVerified || customer?.phoneVerified);

  if (isLoadingCustomer) {
    return (
      <ScreenShell hideAppHeader>
        <ActivityIndicator
          size="large"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell hideAppHeader contentStyle={styles.content}>
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
          onPress={
            isVerified
              ? () =>
                  router.push({
                    pathname: "/d/send-messages-to-customers",
                    params: { recipientName: customer?.name, count: "1" },
                  })
              : undefined
          }
          style={!isVerified ? { opacity: 0.4 } : undefined}
        />
      </View>

      <AppText style={styles.customerName}>{customer?.name ?? "—"}</AppText>
      <AppText style={styles.customerPhone}>
        {customer?.phone ?? customer?.email ?? t("common.noData")}
        {customer?.emailVerified || customer?.phoneVerified ? ` (${t("common.verified")})` : ""}
      </AppText>

      <SegmentedTabs
        tabs={getDetailTabs(t)}
        activeKey={activeTab}
        onTabPress={setActiveTab}
        style={styles.tabs}
      />

      {activeTab === "general" && customer && (
        <View style={styles.tabContent}>
          <View style={styles.statRow}>
            <StatCard
              label={t("customers.bookingHistory")}
              value={formatCurrency(customer.totalSpend)}
              style={styles.statCard}
            />
            <StatCard
              label={t("customers.books")}
              value={String(customer.totalBookings)}
              style={styles.statCard}
            />
          </View>
          <View style={styles.statRow}>
            <StatCard
              label={t("home.walkIn")}
              value={String(customer.walkInCount)}
              iconName="people"
              iconColor={Colors.brand.primary}
              style={styles.statCard}
            />
            <StatCard
              label={t("home.appointment")}
              value={String(customer.appointmentCount)}
              iconName="calendar"
              iconColor={Colors.brand.primary}
              style={styles.statCard}
            />
          </View>
          <CustomerBookingChart
            title={t("bookings.detail")}
              subtitle={`${customer.completedCount} ${t("schedule.status.completed")} · ${customer.cancelledCount} ${t("schedule.status.cancelled")}`}
            data={chartData}
            style={styles.chartCard}
          />
        </View>
      )}

      {activeTab === "books" && (
        <View style={styles.tabContent}>
          <View style={styles.bookingHeader}>
            <AppText style={styles.bookingTitle}>
              {t("bookings.detail")}{" "}
              <AppText style={styles.bookingCount}>({bookings.length})</AppText>
            </AppText>
            <TouchableOpacity
              style={styles.filterPill}
              onPress={() => setFilterVisible(true)}
              activeOpacity={0.8}
            >
              <AppText style={styles.filterLabel}>
                {getScheduleStatusOptions(t).find((o) => o.value === statusFilter)
                  ?.label ?? t("common.all")}
              </AppText>
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
              {bookings.map((b: { id: string; referenceNumber: string; status: string; type: string; handledByName: string | null; createdAt: Date; totalAmount: number }) => (
                <BookingCard
                  key={b.id}
                  customerName={b.referenceNumber}
                  barberName={b.handledByName ?? "—"}
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
                  bookingType={b.type as "walk_in" | "appointment"}
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
            options={getScheduleStatusOptions(t)}
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
          <AppText style={styles.noMessages}>{t("customers.noBookings")}</AppText>
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 80 },
  content: { paddingBottom: 200 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  topBarSpacer: { flex: 1 },
  customerName: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 8,
    letterSpacing: -0.8,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 16,
  },
  tabs: { marginBottom: 20 },
  tabContent: { gap: 12 },
  statRow: { flexDirection: "row", gap: 16 },
  statCard: { flex: 1 },
  chartCard: {},
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bookingTitle: { fontSize: 22, fontWeight: "700", color: Colors.text.primary, letterSpacing: -0.5 },
  bookingCount: { color: Colors.icon.muted, fontWeight: "500" },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  bookingList: { gap: 12 },
  statusMenu: { top: 36, right: 0 },
  noMessages: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 24,
  },
});
