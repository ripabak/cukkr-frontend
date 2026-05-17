import { ScreenShell } from "@/src/components/ScreenShell";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useAnalyticsBarbers,
  useAnalyticsBarbersList,
} from "../hooks";
import type { AnalyticsRange } from "../services/analytics.service";
import { formatRupiah } from "../utils/format";
import { BarChart } from "../components/BarChart";
import { RangePicker } from "../components/RangePicker";

export function AnalyticsBarbersScreen() {
  const router = useRouter();
  const { range: rangeParam } = useLocalSearchParams<{ range?: AnalyticsRange }>();
  const [range, setRange] = useState<AnalyticsRange>(rangeParam ?? "month");

  const { data: chartData, isLoading: chartLoading } = useAnalyticsBarbers(range);
  const { data: listData, isLoading: listLoading } = useAnalyticsBarbersList(range);

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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Barbers</Text>
          <View style={styles.topBarRight} />
        </View>
      }
    >
      <RangePicker value={range} onChange={setRange} />

      {(chartLoading || listLoading) && barbers.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        </View>
      ) : null}

      {/* Revenue by barber chart */}
      {chartPoints.length > 0 ? (
        <View style={styles.chartCard}>
          <Text style={styles.chartCardTitle}>Revenue by Barber</Text>
          <View style={styles.chartWrap}>
            <BarChart data={chartPoints} chartHeight={130} />
          </View>
        </View>
      ) : null}

      {/* Barbers list */}
      {barbers.length > 0 ? (
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>
              All Barbers ({barbers.length})
            </Text>
            {totalRevenue > 0 ? (
              <Text style={styles.totalLabel}>{formatRupiah(totalRevenue)}</Text>
            ) : null}
          </View>

          {barbers.map((barber, i) => {
            const revenueShare = totalRevenue > 0 ? (barber.totalRevenue / totalRevenue) * 100 : 0;
            return (
              <View key={barber.barberId} style={styles.barberRow}>
                <View style={styles.barberLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{i + 1}</Text>
                  </View>
                  <View style={styles.barberAvatar}>
                    {barber.imageUrl ? (
                      <Image
                        source={{ uri: barber.imageUrl }}
                        style={styles.barberAvatarImg}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.barberAvatarPlaceholder}>
                        <Text style={styles.barberInitial}>
                          {barber.name?.[0]?.toUpperCase() ?? "?"}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.barberInfo}>
                    <Text style={styles.barberName} numberOfLines={1}>{barber.name}</Text>
                    <Text style={styles.barberMeta}>
                      {barber.totalCustomers} customer{barber.totalCustomers !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.barberRight}>
                  <Text style={styles.barberRevenue}>{formatRupiah(barber.totalRevenue)}</Text>
                  <Text style={styles.barberShare}>
                    {revenueShare.toFixed(0)}%
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Progress bars by revenue share */}
          <View style={styles.shareSection}>
            <Text style={styles.shareSectionTitle}>Revenue Share</Text>
            {barbers.map((barber) => {
              const share = totalRevenue > 0 ? (barber.totalRevenue / totalRevenue) * 100 : 0;
              return (
                <View key={barber.barberId} style={styles.shareRow}>
                  <Text style={styles.shareName} numberOfLines={1}>{barber.name.split(" ")[0]}</Text>
                  <View style={styles.shareBarWrap}>
                    <View style={[styles.shareBar, { width: `${Math.max(share, share > 0 ? 2 : 0)}%` }]} />
                  </View>
                  <Text style={styles.sharePercent}>{share.toFixed(0)}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : !chartLoading && !listLoading ? (
        <Text style={styles.emptyText}>No barber data for this period</Text>
      ) : null}
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
  chartCard: {
    marginTop: 16,
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
    fontWeight: "700",
    color: Colors.text.primary,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
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
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.text.secondary,
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
    backgroundColor: Colors.brand.primarySurface,
    borderWidth: 1,
    borderColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  barberInitial: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.brand.primaryDark,
  },
  barberInfo: {
    flex: 1,
    gap: 2,
  },
  barberName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  barberMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  barberRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  barberRevenue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  barberShare: {
    fontSize: 11,
    color: Colors.text.muted,
    fontWeight: "500",
  },
  shareSection: {
    marginTop: 20,
    gap: 10,
  },
  shareSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
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
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  shareBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bg.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  shareBar: {
    height: 8,
    backgroundColor: Colors.brand.primary,
    borderRadius: 4,
  },
  sharePercent: {
    width: 32,
    fontSize: 11,
    fontWeight: "600",
    color: Colors.text.muted,
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 14,
    color: Colors.text.muted,
  },
});
