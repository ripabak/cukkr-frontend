import { ScreenShell } from "@/src/components/ScreenShell";
import { StatusFilterMenu } from "@/src/components/StatusFilterMenu";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
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

function getStatusOptions(t: (key: string) => string) {
  return [
    { label: t("analytics.all"), value: "all" },
    { label: t("analytics.newCustomer"), value: "new", color: Colors.status.success },
    { label: t("analytics.returnCustomer"), value: "return", color: Colors.status.info },
  ];
}

function CustomerStatusPill({ status, t }: { status: "new" | "return"; t: (key: string) => string }) {
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
        {isNew ? t("analytics.newCustomer") : t("analytics.returnCustomer")}
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
  const { t } = useI18nContext();
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
              options={getStatusOptions(t)}
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
        <AppText style={styles.pageTitle}>{t("customers.title")}</AppText>
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
              label={t("customers.title")}
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
                  <AppText style={styles.splitLabel}>{t("home.walkIn")}</AppText>
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
                  <AppText style={styles.splitLabel}>{t("home.appointment")}</AppText>
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
              label={t("customers.title")}
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
              label={t("customers.title")}
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
            <AppText style={styles.chartCardTitle}>{t("customers.title")}</AppText>
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
            {t("customers.title")}{meta ? ` (${meta.totalItems})` : ""}
          </AppText>
          <TouchableOpacity
            ref={filterBtnRef}
            style={styles.filterPill}
            onPress={handleOpenStatusMenu}
            activeOpacity={0.8}
          >
            <AppText style={styles.filterPillText}>
              {getStatusOptions(t).find((o) => o.value === statusFilter)?.label ??
                t("analytics.all")}
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
          <AppText style={styles.emptyText}>{t("components.emptyState.defaultMessage")}</AppText>
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
                  <CustomerStatusPill status={c.status} t={t} />
                </View>
                <AppText style={styles.customerMeta}>
                  {c.totalVisits} {t("customers.visit", { count: String(c.totalVisits) })}
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
    paddingBottom: 200,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 40,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
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
    borderRadius: 16,
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
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
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
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
    elevation: 1,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  listLoader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 15,
    color: Colors.text.secondary,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
    marginBottom: 8,
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  customerMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  customerRevenue: {
    fontSize: 14,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
