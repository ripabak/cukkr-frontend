import { ScreenShell } from "@/src/components/ScreenShell";
import { Skeleton } from "@/src/components/Skeleton";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
  const { t } = useI18nContext();
  const { range: rangeParam } = useLocalSearchParams<{
    range?: AnalyticsRange;
  }>();
  const [range, setRange] = useState<AnalyticsRange>(rangeParam ?? "month");
  const [page, setPage] = useState(1);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

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
            style={[styles.backBtn, Neu.soft(colors.bg.surface, 0.7)]}
            activeOpacity={0.85}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <AppText style={styles.pageTitle}>{t("services.title")}</AppText>
          <View style={styles.topBarRight} />
        </View>
      }
    >
      <RangePicker value={range} onChange={handleRangeChange} />

      {svcLoading && !svcData ? (
        <View style={styles.skeletonWrap}>
          <Skeleton.StatTiles perRow={2} count={2} height={104} />
          <View style={[styles.chartCard, Neu.raised(colors.bg.surface, 1.1)]}>
            <Skeleton width="30%" height={13} style={styles.skeletonChartTitle} />
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
            value={formatRupiah(stats.totalRevenue?.current ?? 0)}
            icon={
              <Ionicons
                name="cash"
                size={16}
                color={colors.brand.primary}
              />
            }
            stat={stats.totalRevenue ?? EMPTY_STAT}
            style={styles.statFlex}
          />
        </View>
      ) : null}

      {chart.length > 0 ? (
        <View style={[styles.chartCard, Neu.raised(colors.bg.surface, 1.1)]}>
          <AppText style={styles.chartCardTitle}>{t("services.title")}</AppText>
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
          <View style={styles.listSkeleton}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton.Card key={i} thumb={24} height={74} radius={16} />
            ))}
          </View>
        ) : services.length === 0 ? (
          <AppText style={styles.emptyText}>
            {t("components.emptyState.defaultMessage")}
          </AppText>
        ) : (
          services.map((svc, i) => (
            <TouchableOpacity
              key={svc.serviceId}
              style={[styles.serviceRow, Neu.soft(colors.bg.surface, 0.7)]}
              activeOpacity={0.85}
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
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: c.bg.default,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    width: 36,
  },
  skeletonWrap: {
    paddingTop: 16,
  },
  skeletonChartTitle: {
    marginBottom: 12,
  },
  listSkeleton: {
    gap: 8,
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
    borderRadius: 20,
    padding: 16,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.secondary,
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
    fontWeight: "600",
    color: c.text.primary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
    color: c.text.muted,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 16,
    gap: 12,
    marginBottom: 8,
  },
  serviceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.default,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  serviceRankText: {
    fontSize: 11,
    fontWeight: "600",
    color: c.text.secondary,
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
    fontWeight: "500",
    color: c.text.primary,
    flex: 1,
  },
  serviceCountBadge: {
    backgroundColor: c.brand.primarySurface,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  serviceCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: c.brand.primaryDark,
  },
  progressWrap: {
    height: 5,
    backgroundColor: c.border.light,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: 5,
    backgroundColor: c.brand.primary,
    borderRadius: 3,
  },
  serviceMeta: {
    fontSize: 12,
    color: c.text.secondary,
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