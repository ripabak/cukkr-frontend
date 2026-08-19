import { ScreenShell } from "@/src/components/ScreenShell";
import { Skeleton } from "@/src/components/Skeleton";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAnalyticsBarbers, useAnalyticsBarbersList } from "../hooks";
import type { AnalyticsRange } from "../services/analytics.service";
import { formatRupiah } from "../utils/format";
import { BarChart } from "../components/BarChart";
import { RangePicker } from "../components/RangePicker";

export function AnalyticsBarbersScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { range: rangeParam } = useLocalSearchParams<{
    range?: AnalyticsRange;
  }>();
  const [range, setRange] = useState<AnalyticsRange>(rangeParam ?? "month");
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const { data: chartData, isLoading: chartLoading } =
    useAnalyticsBarbers(range);
  const { data: listData, isLoading: listLoading } =
    useAnalyticsBarbersList(range);

  const chartPoints = (chartData?.chart ?? []).map((b) => ({
    label: b.barberName.split(" ")[0],
    value: b.value,
  }));

  const barbers = Array.isArray(listData) ? listData : [];
  const totalRevenue = barbers.reduce((s, b) => s + b.totalRevenue, 0);

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
          <AppText style={styles.pageTitle}>{t("barbers.title")}</AppText>
          <View style={styles.topBarRight} />
        </View>
      }
    >
      <RangePicker value={range} onChange={setRange} />

      {(chartLoading || listLoading) && barbers.length === 0 ? (
        <View style={styles.skeletonWrap}>
          {/* Revenue by barber chart */}
          <View style={[styles.chartCard, Neu.raised(colors.bg.surface, 1.1)]}>
            <Skeleton width="30%" height={13} style={styles.skeletonChartTitle} />
            <Skeleton width="100%" height={150} radius={12} />
          </View>

          {/* Barbers list */}
          <View style={styles.listSection}>
            <Skeleton
              width={130}
              height={17}
              style={styles.skeletonListHeaderGap}
            />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Card
                key={i}
                thumb={40}
                height={68}
                radius={16}
                style={styles.skeletonListRow}
              />
            ))}

            {/* Revenue-share progress rows */}
            <View style={styles.skeletonShareSection}>
              <Skeleton width={100} height={13} />
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={styles.skeletonShareRow}>
                  <Skeleton width={64} height={12} />
                  <Skeleton
                    width="100%"
                    height={8}
                    radius={4}
                    style={styles.skeletonShareBar}
                  />
                  <Skeleton width={32} height={11} />
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {/* Revenue by barber chart */}
      {chartPoints.length > 0 ? (
        <View style={[styles.chartCard, Neu.raised(colors.bg.surface, 1.1)]}>
          <AppText style={styles.chartCardTitle}>{t("services.price")}</AppText>
          <View style={styles.chartWrap}>
            <BarChart data={chartPoints} chartHeight={130} />
          </View>
        </View>
      ) : null}

      {/* Barbers list */}
      {barbers.length > 0 ? (
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <AppText style={styles.sectionTitle}>
              {t("barbers.title")} ({barbers.length})
            </AppText>
            {totalRevenue > 0 ? (
              <AppText style={styles.totalLabel}>
                {formatRupiah(totalRevenue)}
              </AppText>
            ) : null}
          </View>

          {barbers.map((barber, i) => {
            const revenueShare =
              totalRevenue > 0 ? (barber.totalRevenue / totalRevenue) * 100 : 0;
            return (
              <View key={barber.barberId} style={[styles.barberRow, Neu.soft(colors.bg.surface, 0.7)]}>
                <View style={styles.barberLeft}>
                  <View style={styles.rankBadge}>
                    <AppText style={styles.rankText}>{i + 1}</AppText>
                  </View>
                  <View style={styles.barberAvatar}>
                    {barber.imageThumb || barber.imageUrl ? (
                      <Image
                        source={{ uri: barber.imageThumb ?? barber.imageUrl ?? undefined }}
                        style={styles.barberAvatarImg}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.barberAvatarPlaceholder}>
                        <AppText style={styles.barberInitial}>
                          {barber.name?.[0]?.toUpperCase() ?? "?"}
                        </AppText>
                      </View>
                    )}
                  </View>
                  <View style={styles.barberInfo}>
                    <AppText style={styles.barberName} numberOfLines={1}>
                      {barber.name}
                    </AppText>
                    <AppText style={styles.barberMeta}>
                      {t("barbers.customersCount", { count: String(barber.totalCustomers) })}
                    </AppText>
                  </View>
                </View>
                <View style={styles.barberRight}>
                  <AppText style={styles.barberRevenue}>
                    {formatRupiah(barber.totalRevenue)}
                  </AppText>
                  <AppText style={styles.barberShare}>
                    {revenueShare.toFixed(0)}%
                  </AppText>
                </View>
              </View>
            );
          })}

          {/* Progress bars by revenue share */}
          <View style={styles.shareSection}>
            <AppText style={styles.shareSectionTitle}>{t("services.price")}</AppText>
            {barbers.map((barber) => {
              const share =
                totalRevenue > 0
                  ? (barber.totalRevenue / totalRevenue) * 100
                  : 0;
              return (
                <View key={barber.barberId} style={styles.shareRow}>
                  <AppText style={styles.shareName} numberOfLines={1}>
                    {barber.name.split(" ")[0]}
                  </AppText>
                  <View style={styles.shareBarWrap}>
                    <View
                      style={[
                        styles.shareBar,
                        { width: `${Math.max(share, share > 0 ? 2 : 0)}%` },
                      ]}
                    />
                  </View>
                  <AppText style={styles.sharePercent}>{share.toFixed(0)}%</AppText>
                </View>
              );
            })}
          </View>
        </View>
      ) : !chartLoading && !listLoading ? (
          <AppText style={styles.emptyText}>{t("components.emptyState.defaultMessage")}</AppText>
      ) : null}
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
    paddingTop: 8,
  },
  skeletonChartTitle: {
    marginBottom: 12,
  },
  skeletonListHeaderGap: {
    marginBottom: 12,
  },
  skeletonListRow: {
    marginBottom: 8,
  },
  skeletonShareSection: {
    marginTop: 20,
    gap: 10,
  },
  skeletonShareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skeletonShareBar: {
    flex: 1,
  },
  chartCard: {
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.secondary,
    marginBottom: 12,
  },
  chartWrap: {},
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
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.secondary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  barberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "600",
    color: c.text.secondary,
  },
  barberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  barberAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  barberAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.brand.primarySurface,
    borderWidth: 1,
    borderColor: c.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  barberInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: c.brand.primaryDark,
  },
  barberInfo: {
    flex: 1,
    gap: 2,
  },
  barberName: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
  },
  barberMeta: {
    fontSize: 12,
    color: c.text.secondary,
  },
  barberRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  barberRevenue: {
    fontSize: 14,
    fontWeight: "600",
    color: c.text.primary,
  },
  barberShare: {
    fontSize: 11,
    color: c.text.muted,
    fontWeight: "500",
  },
  shareSection: {
    marginTop: 20,
    gap: 10,
  },
  shareSectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: c.text.secondary,
    marginBottom: 4,
  },
  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shareName: {
    width: 64,
    fontSize: 12,
    color: c.text.secondary,
    fontWeight: "500",
  },
  shareBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: c.bg.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  shareBar: {
    height: 8,
    backgroundColor: c.brand.primary,
    borderRadius: 4,
  },
  sharePercent: {
    width: 32,
    fontSize: 11,
    fontWeight: "500",
    color: c.text.muted,
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 14,
    color: c.text.muted,
  },
  });