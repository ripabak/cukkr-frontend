import { ScreenShell } from "@/src/components/ScreenShell";
import { StatusFilterMenu } from "@/src/components/StatusFilterMenu";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useAnalyticsCustomers, useAnalyticsCustomersList } from "../hooks";
import type { AnalyticsRange } from "../services/analytics.service";
import { formatDate, formatRupiah } from "../utils/format";
import { BarChart } from "../components/BarChart";
import { RangePicker } from "../components/RangePicker";
import { StatCard, TrendBadge } from "../components/StatCard";

const EMPTY_STAT = {
  current: 0,
  previous: 0,
  change: null,
  direction: "neutral" as const,
};

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "New", value: "new", color: Colors.status.success },
  { label: "Return", value: "return", color: Colors.status.info },
];

function CustomerStatusPill({ status }: { status: "new" | "return" }) {
  const isNew = status === "new";
  return (
    <View
      style={[
        statusStyles.pill,
        isNew ? statusStyles.new : statusStyles.return,
      ]}
    >
      <AppText
        style={[
          statusStyles.text,
          isNew ? statusStyles.newText : statusStyles.returnText,
        ]}
      >
        {isNew ? "New" : "Return"}
      </AppText>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  pill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  new: { backgroundColor: Colors.status.successSurface },
  return: { backgroundColor: Colors.status.infoSurface },
  text: { fontSize: 11, fontWeight: "600" },
  newText: { color: Colors.status.success },
  returnText: { color: Colors.status.info },
});

export function AnalyticsCustomersScreen() {
  const router = useRouter();
  const { range: rangeParam } = useLocalSearchParams<{
    range?: AnalyticsRange;
  }>();
  const [range, setRange] = useState<AnalyticsRange>(rangeParam ?? "month");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "return">(
    "all",
  );
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [page, setPage] = useState(1);
  const filterBtnRef = useRef<View>(null);

  const { data: custData, isLoading: custLoading } =
    useAnalyticsCustomers(range);
  const { data: listData, isLoading: listLoading } = useAnalyticsCustomersList(
    range,
    statusFilter,
    page,
  );

  const stats = custData?.stats;
  const chart = custData?.chart;
  const customers = listData?.data ?? [];
  const meta = listData?.meta;

  const handleRangeChange = (r: AnalyticsRange) => {
    setRange(r);
    setPage(1);
  };

  const handleStatusChange = (v: string) => {
    setStatusFilter(v as "all" | "new" | "return");
    setPage(1);
  };

  const handleOpenStatusMenu = () => {
    filterBtnRef.current?.measure(
      (
        _x: number,
        _y: number,
        _w: number,
        height: number,
        _px: number,
        pageY: number,
      ) => {
        setMenuTop(pageY + height + 4);
      },
    );
    setStatusMenuVisible(true);
  };

  return (
    <ScreenShell
      contentStyle={styles.scrollContent}
      overlaySlot={
        statusMenuVisible ? (
          <View style={styles.menuOverlay}>
            <StatusFilterMenu
              visible
              options={STATUS_OPTIONS}
              selected={statusFilter}
              onSelect={handleStatusChange}
              onClose={() => setStatusMenuVisible(false)}
              style={{ top: menuTop, right: 20 }}
            />
          </View>
        ) : null
      }
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <AppText style={styles.pageTitle}>Customers</AppText>
        <View style={styles.topBarRight} />
      </View>

      <RangePicker value={range} onChange={handleRangeChange} />

      {custLoading && !custData ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        </View>
      ) : null}

      {stats ? (
        <>
          {/* Top row: total + split */}
          <View style={styles.statsRow}>
            <StatCard
              label="Customers"
              value={String(stats.totalCustomers?.current ?? 0)}
              icon={
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.totalCustomers ?? EMPTY_STAT}
              style={styles.statFlex}
            />
            <View style={styles.splitCol}>
              <View style={styles.splitCard}>
                <View style={styles.splitCardHeader}>
                  <Ionicons
                    name="walk-outline"
                    size={12}
                    color={Colors.text.secondary}
                  />
                  <AppText style={styles.splitLabel}>Walk-in</AppText>
                </View>
                <AppText style={styles.splitValue}>
                  {stats.totalWalkIn?.current ?? 0}
                </AppText>
              </View>
              <View style={styles.splitCard}>
                <View style={styles.splitCardHeader}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={Colors.text.secondary}
                  />
                  <AppText style={styles.splitLabel}>Appt</AppText>
                </View>
                <AppText style={styles.splitValue}>
                  {stats.totalAppointment?.current ?? 0}
                </AppText>
              </View>
            </View>
          </View>

          {/* New / Return */}
          <View style={[styles.statsRow, { marginTop: 10 }]}>
            <StatCard
              label="New Customers"
              value={String(stats.totalNew?.current ?? 0)}
              icon={
                <Ionicons
                  name="person-add-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.totalNew ?? EMPTY_STAT}
              style={styles.statFlex}
            />
            <StatCard
              label="Returning"
              value={String(stats.totalReturn?.current ?? 0)}
              icon={
                <Ionicons
                  name="repeat-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.totalReturn ?? EMPTY_STAT}
              style={styles.statFlex}
            />
          </View>
        </>
      ) : null}

      {chart && chart.length > 0 ? (
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <AppText style={styles.chartCardTitle}>Customer Trend</AppText>
            {stats ? (
              <TrendBadge
                direction={stats.totalCustomers?.direction ?? "neutral"}
                change={stats.totalCustomers?.change ?? null}
              />
            ) : null}
          </View>
          <BarChart
            data={chart}
            barColor={Colors.status.info}
            chartHeight={130}
          />
        </View>
      ) : null}

      {/* Customers list */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <AppText style={styles.sectionTitle}>
            Customers{meta ? ` (${meta.totalItems})` : ""}
          </AppText>
          <TouchableOpacity
            ref={filterBtnRef}
            style={styles.filterPill}
            onPress={handleOpenStatusMenu}
            activeOpacity={0.8}
          >
            <AppText style={styles.filterPillText}>
              {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
                "All"}
            </AppText>
            <Ionicons
              name="chevron-down"
              size={13}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {listLoading && customers.length === 0 ? (
          <ActivityIndicator
            size="small"
            color={Colors.brand.primary}
            style={styles.listLoader}
          />
        ) : customers.length === 0 ? (
          <AppText style={styles.emptyText}>No customers found</AppText>
        ) : (
          customers.map((c) => (
            <TouchableOpacity
              key={c.customerId}
              style={styles.customerRow}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: "/d/customer-detail-general",
                  params: { customerId: c.customerId },
                })
              }
            >
              <View style={styles.customerAvatar}>
                <AppText style={styles.customerInitial}>
                  {c.customerName?.[0]?.toUpperCase() ?? "?"}
                </AppText>
              </View>
              <View style={styles.customerInfo}>
                <View style={styles.customerNameRow}>
                  <AppText style={styles.customerName} numberOfLines={1}>
                    {c.customerName}
                  </AppText>
                  <CustomerStatusPill status={c.status} />
                </View>
                <AppText style={styles.customerMeta}>
                  {c.totalVisits} visit{c.totalVisits !== 1 ? "s" : ""}
                  {c.lastVisitDate ? ` · ${formatDate(c.lastVisitDate)}` : ""}
                </AppText>
              </View>
              <AppText style={styles.customerRevenue}>
                {formatRupiah(c.totalRevenue)}
              </AppText>
            </TouchableOpacity>
          ))
        )}

        {meta && meta.totalPages > 1 ? (
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={!meta.hasPrev}
              onPress={() => setPage((p) => p - 1)}
              style={[styles.pageBtn, !meta.hasPrev && styles.pageBtnDisabled]}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={meta.hasPrev ? Colors.text.primary : Colors.text.muted}
              />
            </TouchableOpacity>
            <AppText style={styles.pageLabel}>
              {meta.page} / {meta.totalPages}
            </AppText>
            <TouchableOpacity
              disabled={!meta.hasNext}
              onPress={() => setPage((p) => p + 1)}
              style={[styles.pageBtn, !meta.hasNext && styles.pageBtnDisabled]}
            >
              <Ionicons
                name="chevron-forward"
                size={16}
                color={meta.hasNext ? Colors.text.primary : Colors.text.muted}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  pageTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  topBarRight: {
    width: 36,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statFlex: {
    flex: 1,
  },
  splitCol: {
    flex: 1,
    gap: 8,
  },
  splitCard: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    justifyContent: "center",
  },
  splitCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  splitLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  splitValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  chartCard: {
    marginTop: 14,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chartCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  listSection: {
    marginTop: 20,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.bg.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  listLoader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
    color: Colors.text.muted,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    gap: 10,
  },
  customerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.brand.primarySurface,
    borderWidth: 1,
    borderColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  customerInitial: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.brand.primaryDark,
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  customerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  customerMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  customerRevenue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
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
