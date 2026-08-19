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
import { useAnalyticsRevenue, useAnalyticsRevenueBookings } from "../hooks";
import type { AnalyticsRange } from "../services/analytics.service";
import { formatDate, formatRupiah, formatRupiahFull } from "../utils/format";
import { BarChart } from "../components/BarChart";
import { RangePicker } from "../components/RangePicker";
import { StatCard, TrendBadge } from "../components/StatCard";

const EMPTY_STAT = {
  current: 0,
  previous: 0,
  change: null,
  direction: "neutral" as const,
};

function getTypeOptions(t: (key: string) => string) {
  return [
    { label: t("analytics.all"), value: "all" },
    { label: t("analytics.walkIn"), value: "walk_in" },
    { label: t("analytics.appointment"), value: "appointment" },
  ];
}

function BookingTypeIcon({ type }: { type: "walk_in" | "appointment" }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createBookingTypeStyles);
  return (
    <View
      style={[
        styles.badge,
        type === "walk_in" ? styles.walkIn : styles.appt,
      ]}
    >
      <Ionicons
        name={type === "walk_in" ? "walk" : "calendar"}
        size={10}
        color={colors.text.inverse}
      />
    </View>
  );
}

const createBookingTypeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  walkIn: { backgroundColor: c.status.info },
  appt: { backgroundColor: c.status.warning },
  });

export function AnalyticsRevenueScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { range: rangeParam } = useLocalSearchParams<{
    range?: AnalyticsRange;
  }>();
  const [range, setRange] = useState<AnalyticsRange>(rangeParam ?? "month");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "walk_in" | "appointment"
  >("all");
  const [page, setPage] = useState(1);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const { data: revData, isLoading: revLoading } = useAnalyticsRevenue(range);
  const { data: bookingsData, isLoading: bookingsLoading } =
    useAnalyticsRevenueBookings(range, typeFilter, page);

  const stats = revData?.stats;
  const chart = revData?.chart;
  const bookings = bookingsData?.data ?? [];
  const meta = bookingsData?.meta;

  const handleRangeChange = (r: AnalyticsRange) => {
    setRange(r);
    setPage(1);
  };

  const handleTypeChange = (v: string) => {
    setTypeFilter(v as "all" | "walk_in" | "appointment");
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
        <AppText style={styles.pageTitle}>{t("services.price")}</AppText>
        <View style={styles.topBarRight} />
      </View>

      <RangePicker value={range} onChange={handleRangeChange} />

      {revLoading && !revData ? (
        <View style={styles.skeletonWrap}>
          <Skeleton.StatTiles perRow={3} count={3} height={128} />
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
        <View style={styles.statsRow}>
            <StatCard
              label={t("home.totalBookings")}
            value={String(stats.totalBookings?.current ?? 0)}
            icon={
              <Ionicons
                name="receipt"
                size={16}
                color={colors.brand.primary}
              />
            }
            stat={stats.totalBookings ?? EMPTY_STAT}
            style={styles.statFlex}
          />
            <StatCard
              label={t("services.price")}
            value={formatRupiah(stats.avgRevenuePerBooking?.current ?? 0)}
            icon={
              <Ionicons
                name="cash"
                size={16}
                color={colors.brand.primary}
              />
            }
            stat={stats.avgRevenuePerBooking ?? EMPTY_STAT}
            style={styles.statFlex}
          />
            <StatCard
              label={t("services.duration")}
            value={`${stats.avgTime?.current ?? 0}m`}
            icon={
              <Ionicons
                name="time"
                size={16}
                color={colors.brand.primary}
              />
            }
            stat={stats.avgTime ?? EMPTY_STAT}
            style={styles.statFlex}
          />
        </View>
      ) : null}

      {chart && chart.length > 0 ? (
        <View style={[styles.chartCard, Neu.raised(colors.bg.surface)]}>
          <View style={styles.chartCardHeader}>
            <AppText style={styles.chartCardTitle}>{t("services.price")}</AppText>
            {stats ? (
              <TrendBadge
                direction={stats.totalBookings?.direction ?? "neutral"}
                change={stats.totalBookings?.change ?? null}
              />
            ) : null}
          </View>
          <BarChart data={chart} chartHeight={130} />
        </View>
      ) : null}

      {/* Bookings list */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <AppText style={styles.sectionTitle}>
            {t("analytics.transactions")}{meta ? ` (${meta.totalItems})` : ""}
          </AppText>
          <FilterPicker
            options={getTypeOptions(t)}
            selected={typeFilter}
            onSelect={handleTypeChange}
            pillStyle={[styles.filterPill, Neu.soft(colors.bg.surface, 0.7)]}
            pillTextStyle={styles.filterPillText}
          />
        </View>

        {bookingsLoading && bookings.length === 0 ? (
          <View style={styles.listSkeleton}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.skeletonBookingRow}>
                <View style={styles.skeletonBookingLeft}>
                  <Skeleton width={18} height={18} radius={9} />
                  <View style={styles.skeletonBookingLines}>
                    <Skeleton width="52%" height={13} />
                    <Skeleton width="70%" height={11} />
                  </View>
                </View>
                <Skeleton width={64} height={13} />
              </View>
            ))}
          </View>
        ) : bookings.length === 0 ? (
          <AppText style={styles.emptyText}>{t("components.emptyState.defaultMessage")}</AppText>
        ) : (
          bookings.map((bk) => (
            <TouchableOpacity
              key={bk.bookingId}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/d/booking-detail",
                  params: { id: bk.bookingId },
                })
              }
              style={styles.bookingRow}
            >
              <View style={styles.bookingLeft}>
                <View style={styles.bookingIconRow}>
                  <BookingTypeIcon type={bk.type} />
                  <AppText style={styles.bookingCustomer} numberOfLines={1}>
                    {bk.customerName}
                  </AppText>
                </View>
                <AppText style={styles.bookingMeta} numberOfLines={1}>
                  {bk.services.join(", ")} · {formatDate(bk.completedAt)}
                </AppText>
              </View>
              <AppText style={styles.bookingRevenue}>
                {formatRupiahFull(bk.revenue)}
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
  skeletonBookingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.border.light,
    gap: 12,
  },
  skeletonBookingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  skeletonBookingLines: {
    flex: 1,
    gap: 4,
  },
  listSkeleton: {
    gap: 0,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  statFlex: {
    flex: 1,
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
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.border.light,
    gap: 12,
  },
  bookingLeft: {
    flex: 1,
    gap: 3,
  },
  bookingIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bookingCustomer: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
    flex: 1,
  },
  bookingMeta: {
    fontSize: 12,
    color: c.text.secondary,
    paddingLeft: 24,
  },
  bookingRevenue: {
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
    marginBottom: 8,
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