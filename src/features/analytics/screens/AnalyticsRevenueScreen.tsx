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
  return (
    <View
      style={[
        bookingTypeStyles.badge,
        type === "walk_in" ? bookingTypeStyles.walkIn : bookingTypeStyles.appt,
      ]}
    >
      <Ionicons
        name={type === "walk_in" ? "walk" : "calendar"}
        size={10}
        color={Colors.text.inverse}
      />
    </View>
  );
}

const bookingTypeStyles = StyleSheet.create({
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  walkIn: { backgroundColor: Colors.status.info },
  appt: { backgroundColor: Colors.status.warning },
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
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [page, setPage] = useState(1);
  const filterBtnRef = useRef<View>(null);

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

  const handleOpenTypeMenu = () => {
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
    setTypeMenuVisible(true);
  };

  return (
    <ScreenShell
      contentStyle={styles.scrollContent}
      overlaySlot={
        typeMenuVisible ? (
          <View style={styles.menuOverlay}>
            <StatusFilterMenu
              visible
              options={getTypeOptions(t)}
              selected={typeFilter}
              onSelect={handleTypeChange}
              onClose={() => setTypeMenuVisible(false)}
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
        <AppText style={styles.pageTitle}>{t("services.price")}</AppText>
        <View style={styles.topBarRight} />
      </View>

      <RangePicker value={range} onChange={handleRangeChange} />

      {revLoading && !revData ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        </View>
      ) : null}

      {stats ? (
        <View style={styles.statsRow}>
            <StatCard
              label={t("home.totalBookings")}
            value={String(stats.totalBookings?.current ?? 0)}
            icon={
              <Ionicons
                name="receipt-outline"
                size={16}
                color={Colors.text.primary}
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
                name="cash-outline"
                size={16}
                color={Colors.text.primary}
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
                name="time-outline"
                size={16}
                color={Colors.text.primary}
              />
            }
            stat={stats.avgTime ?? EMPTY_STAT}
            style={styles.statFlex}
          />
        </View>
      ) : null}

      {chart && chart.length > 0 ? (
        <View style={styles.chartCard}>
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
          <TouchableOpacity
            ref={filterBtnRef}
            style={styles.filterPill}
            onPress={handleOpenTypeMenu}
            activeOpacity={0.8}
          >
            <AppText style={styles.filterPillText}>
              {getTypeOptions(t).find((o) => o.value === typeFilter)?.label ?? t("analytics.all")}
            </AppText>
            <Ionicons
              name="chevron-down"
              size={13}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {bookingsLoading && bookings.length === 0 ? (
          <ActivityIndicator
            size="small"
            color={Colors.brand.primary}
            style={styles.listLoader}
          />
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
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
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
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  bookingMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
    paddingLeft: 24,
  },
  bookingRevenue: {
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
    marginBottom: 8,
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
