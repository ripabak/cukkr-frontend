import { ScreenShell } from "@/src/components/ScreenShell";
import { Colors } from "@/src/theme/colors";
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
import { useAnalyticsServices, useAnalyticsServicesList } from "../hooks";
import type { AnalyticsRange } from "../services/analytics.service";
import { formatRupiah } from "../utils/format";
import { BarChart } from "../components/BarChart";
import { RangePicker } from "../components/RangePicker";
import { StatCard } from "../components/StatCard";

const EMPTY_STAT = {
  current: 0,
  previous: 0,
  change: null,
  direction: "neutral" as const,
};

export function AnalyticsServicesScreen() {
  const router = useRouter();
  const { range: rangeParam } = useLocalSearchParams<{
    range?: AnalyticsRange;
  }>();
  const [range, setRange] = useState<AnalyticsRange>(rangeParam ?? "month");
  const [page, setPage] = useState(1);

  const { data: svcData, isLoading: svcLoading } = useAnalyticsServices(range);
  const { data: listData, isLoading: listLoading } = useAnalyticsServicesList(
    range,
    page,
  );

  const stats = svcData?.stats;
  const chart = svcData?.chart ?? [];
  const services = listData?.data ?? [];
  const meta = listData?.meta;

  const handleRangeChange = (r: AnalyticsRange) => {
    setRange(r);
    setPage(1);
  };

  const maxBookings = Math.max(...services.map((s) => s.totalBookings), 1);

  return (
    <ScreenShell
      contentStyle={styles.scrollContent}
      headerSlot={
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
          <AppText style={styles.pageTitle}>Services</AppText>
          <View style={styles.topBarRight} />
        </View>
      }
    >
      <RangePicker value={range} onChange={handleRangeChange} />

      {svcLoading && !svcData ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        </View>
      ) : null}

      {stats ? (
        <View style={styles.statsRow}>
          <StatCard
            label="Total Bookings"
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
            label="Total Revenue"
            value={formatRupiah(stats.totalRevenue?.current ?? 0)}
            icon={
              <Ionicons
                name="cash-outline"
                size={16}
                color={Colors.text.primary}
              />
            }
            stat={stats.totalRevenue ?? EMPTY_STAT}
            style={styles.statFlex}
          />
        </View>
      ) : null}

      {chart.length > 0 ? (
        <View style={styles.chartCard}>
          <AppText style={styles.chartCardTitle}>Bookings by Service</AppText>
          <BarChart data={chart} chartHeight={130} maxBars={8} />
        </View>
      ) : null}

      {/* Services list */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <AppText style={styles.sectionTitle}>
            Services{meta ? ` (${meta.totalItems})` : ""}
          </AppText>
        </View>

        {listLoading && services.length === 0 ? (
          <ActivityIndicator
            size="small"
            color={Colors.brand.primary}
            style={styles.listLoader}
          />
        ) : services.length === 0 ? (
          <AppText style={styles.emptyText}>
            No services found for this period
          </AppText>
        ) : (
          services.map((svc, i) => (
            <TouchableOpacity
              key={svc.serviceId}
              style={styles.serviceRow}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: "/d/service-detail",
                  params: { serviceId: svc.serviceId },
                })
              }
            >
              <View style={styles.serviceRank}>
                <AppText style={styles.serviceRankText}>
                  {i + 1 + (page - 1) * 20}
                </AppText>
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceNameRow}>
                  <AppText style={styles.serviceName} numberOfLines={1}>
                    {svc.serviceName}
                  </AppText>
                  <View style={styles.serviceCountBadge}>
                    <AppText style={styles.serviceCountText}>
                      {svc.totalBookings}×
                    </AppText>
                  </View>
                </View>
                {/* Progress bar */}
                <View style={styles.progressWrap}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${(svc.totalBookings / maxBookings) * 100}%` },
                    ]}
                  />
                </View>
                <AppText style={styles.serviceMeta}>
                  {svc.percentage}% of bookings · {formatRupiah(svc.revenue)}
                </AppText>
              </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bg.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
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
    gap: 10,
    marginTop: 16,
  },
  statFlex: {
    flex: 1,
  },
  chartCard: {
    marginTop: 14,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 12,
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
  listLoader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
    color: Colors.text.muted,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    gap: 12,
  },
  serviceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  serviceRankText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.text.secondary,
  },
  serviceInfo: {
    flex: 1,
    gap: 5,
  },
  serviceNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  serviceCountBadge: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  serviceCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.brand.primaryDark,
  },
  progressWrap: {
    height: 5,
    backgroundColor: Colors.border.light,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: 5,
    backgroundColor: Colors.brand.primary,
    borderRadius: 3,
  },
  serviceMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
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
});
