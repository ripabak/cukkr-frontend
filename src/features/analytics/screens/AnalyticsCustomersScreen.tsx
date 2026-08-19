import { ScreenShell } from "@/src/components/ScreenShell";
import { Skeleton } from "@/src/components/Skeleton";
import { FilterPicker } from "@/src/components/FilterPicker";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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

function getStatusOptions(t: (key: string) => string, c: ThemeColors) {
  return [
    { label: t("analytics.all"), value: "all" },
    { label: t("analytics.newCustomer"), value: "new", color: c.status.success },
    { label: t("analytics.returnCustomer"), value: "return", color: c.status.info },
  ];
}

function CustomerStatusPill({ status, t }: { status: "new" | "return"; t: (key: string) => string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStatusStyles);
  const isNew = status === "new";
  return (
    <View
      style={[
        styles.pill,
        isNew ? styles.new : styles.return,
      ]}
    >
      <AppText
        style={[
          styles.text,
          isNew ? styles.newText : styles.returnText,
        ]}
      >
        {isNew ? t("analytics.newCustomer") : t("analytics.returnCustomer")}
      </AppText>
    </View>
  );
}

const createStatusStyles = (c: ThemeColors) =>
  StyleSheet.create({
  pill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  new: { backgroundColor: c.status.successSurface },
  return: { backgroundColor: c.status.infoSurface },
  text: { fontSize: 11, fontWeight: "500" },
  newText: { color: c.status.success },
  returnText: { color: c.status.info },
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
  const [page, setPage] = useState(1);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

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

  return (
    <ScreenShell
      contentStyle={styles.scrollContent}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, Neu.soft(colors.bg.surface, 0.7)]}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <AppText style={styles.pageTitle}>{t("customers.title")}</AppText>
        <View style={styles.topBarRight} />
      </View>

      <RangePicker value={range} onChange={handleRangeChange} />

      {custLoading && !custData ? (
        <View style={styles.skeletonWrap}>
          {/* Total + walk-in/appointment split row */}
          <View style={styles.statsRow}>
            <View style={styles.skeletonStatFlex}>
              <Skeleton width="100%" height={128} radius={20} />
            </View>
            <View style={styles.splitCol}>
              <Skeleton width="100%" height={60} radius={16} />
              <Skeleton width="100%" height={60} radius={16} />
            </View>
          </View>
          {/* New / Return row */}
          <View style={[styles.statsRow, { marginTop: 10 }]}>
            <View style={styles.skeletonStatFlex}>
              <Skeleton width="100%" height={128} radius={20} />
            </View>
            <View style={styles.skeletonStatFlex}>
              <Skeleton width="100%" height={128} radius={20} />
            </View>
          </View>

          {/* Customer chart */}
          <View style={[styles.chartCard, Neu.raised(colors.bg.surface)]}>
            <View style={styles.chartCardHeader}>
              <Skeleton width="30%" height={13} />
              <Skeleton width={48} height={18} radius={9} />
            </View>
            <Skeleton width="100%" height={150} radius={12} />
          </View>
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
                  name="people"
                  size={16}
                  color={colors.brand.primary}
                />
              }
              stat={stats.totalCustomers ?? EMPTY_STAT}
              style={styles.statFlex}
            />
            <View style={styles.splitCol}>
              <View style={[styles.splitCard, Neu.soft(colors.bg.surface, 0.7)]}>
                <View style={styles.splitCardHeader}>
                  <Ionicons
                    name="walk"
                    size={12}
                    color={colors.brand.primary}
                  />
                  <AppText style={styles.splitLabel}>{t("home.walkIn")}</AppText>
                </View>
                <AppText style={styles.splitValue}>
                  {stats.totalWalkIn?.current ?? 0}
                </AppText>
              </View>
              <View style={[styles.splitCard, Neu.soft(colors.bg.surface, 0.7)]}>
                <View style={styles.splitCardHeader}>
                  <Ionicons
                    name="calendar"
                    size={12}
                    color={colors.brand.primary}
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
                  name="person-add"
                  size={16}
                  color={colors.brand.primary}
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
                  name="repeat"
                  size={16}
                  color={colors.brand.primary}
                />
              }
              stat={stats.totalReturn ?? EMPTY_STAT}
              style={styles.statFlex}
            />
          </View>
        </>
      ) : null}

      {chart && chart.length > 0 ? (
        <View style={[styles.chartCard, Neu.raised(colors.bg.surface)]}>
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
            barColor={colors.status.info}
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
          <FilterPicker
            options={getStatusOptions(t, colors)}
            selected={statusFilter}
            onSelect={handleStatusChange}
            pillStyle={[styles.filterPill, Neu.soft(colors.bg.surface, 0.7)]}
            pillTextStyle={styles.filterPillText}
          />
        </View>

        {listLoading && customers.length === 0 ? (
          <View style={styles.listSkeleton}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Card key={i} thumb={44} height={80} radius={20} />
            ))}
          </View>
        ) : customers.length === 0 ? (
          <AppText style={styles.emptyText}>{t("components.emptyState.defaultMessage")}</AppText>
        ) : (
          customers.map((c) => (
            <TouchableOpacity
              key={c.customerId}
              style={[styles.customerRow, Neu.raised(colors.bg.surface)]}
              activeOpacity={0.85}
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
              style={[styles.pageBtn, Neu.soft(colors.bg.surface, 0.7), !meta.hasPrev && styles.pageBtnDisabled]}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={meta.hasPrev ? colors.text.primary : colors.text.muted}
              />
            </TouchableOpacity>
            <AppText style={styles.pageLabel}>
              {meta.page} / {meta.totalPages}
            </AppText>
            <TouchableOpacity
              disabled={!meta.hasNext}
              onPress={() => setPage((p) => p + 1)}
              style={[styles.pageBtn, Neu.soft(colors.bg.surface, 0.7), !meta.hasNext && styles.pageBtnDisabled]}
            >
              <Ionicons
                name="chevron-forward"
                size={16}
                color={meta.hasNext ? colors.text.primary : colors.text.muted}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
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
  },
  pageTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: c.text.primary,
  },
  topBarRight: {
    width: 40,
  },
  skeletonWrap: {
    paddingTop: 20,
  },
  skeletonStatFlex: {
    flex: 1,
  },
  listSkeleton: {
    gap: 8,
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
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    color: c.text.secondary,
    fontWeight: "500",
  },
  splitValue: {
    fontSize: 18,
    fontWeight: "600",
    color: c.text.primary,
  },
  chartCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
  },
  chartCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.secondary,
  },
  listSection: {
    marginTop: 20,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    position: "relative",
    zIndex: 999,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: c.text.primary,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 15,
    color: c.text.secondary,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.brand.primarySurface,
    borderWidth: 1,
    borderColor: c.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  customerInitial: {
    fontSize: 15,
    fontWeight: "600",
    color: c.brand.primaryDark,
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
    fontWeight: "500",
    color: c.text.primary,
    flex: 1,
  },
  customerMeta: {
    fontSize: 12,
    color: c.text.secondary,
  },
  customerRevenue: {
    fontSize: 14,
    fontWeight: "600",
    color: c.text.primary,
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
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
  },
  });