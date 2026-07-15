import { Permission } from "@/src/components/Permission";
import { ScreenShell } from "@/src/components/ScreenShell";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "../components/BarChart";
import { HighlightRow } from "../components/HighlightRow";
import { RangePicker } from "../components/RangePicker";
import { StatCard, TrendBadge } from "../components/StatCard";
import { useAnalyticsOverview } from "../hooks";
import type { AnalyticsRange } from "../services/analytics.service";
import { formatRupiah, getRangeLabel } from "../utils/format";

const EMPTY_STAT = {
  current: 0,
  previous: 0,
  change: null,
  direction: "neutral" as const,
};

export function AnalyticsOverviewScreen() {
  const router = useRouter();
  const [range, setRange] = useState<AnalyticsRange>("month");

  const { data, isLoading } = useAnalyticsOverview(range);

  const stats = data?.stats;
  const charts = data?.chart;
  const highlights = data?.highlights;

  return (
    <Permission roles={["owner", "admin"]}>
    <ScreenShell contentStyle={styles.scrollContent}>
      <View style={styles.topBar}>
        <AppText style={styles.pageTitle}>Overview</AppText>
        <AppText style={styles.pageSubtitle}>
          See your barbershop's performance
        </AppText>
      </View>

      <RangePicker value={range} onChange={setRange} />

      {isLoading && !data ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={Colors.brand.primary} />
        </View>
      ) : null}

      {stats ? (
        <>
          {/* Stat cards 2x2 */}
          <View style={styles.statGrid}>
            <StatCard
              label="Revenue"
              value={formatRupiah(stats.totalSales?.current ?? 0)}
              icon={
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.totalSales ?? EMPTY_STAT}
              onPress={() => router.push(`/d/analytics-revenue?range=${range}`)}
            />
            <StatCard
              label="Customers"
              value={String(stats.totalCustomers?.current ?? 0)}
              icon={
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.totalCustomers ?? EMPTY_STAT}
              onPress={() =>
                router.push(`/d/analytics-customers?range=${range}`)
              }
            />
          </View>
          <View style={[styles.statGrid, styles.statGridGap]}>
            <StatCard
              label="Walk-in"
              value={String(stats.walkIns?.current ?? 0)}
              icon={
                <Ionicons
                  name="walk-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.walkIns ?? EMPTY_STAT}
              onPress={() =>
                router.push(`/d/analytics-customers?range=${range}`)
              }
            />
            <StatCard
              label="Appointment"
              value={String(stats.appointments?.current ?? 0)}
              icon={
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={Colors.text.primary}
                />
              }
              stat={stats.appointments ?? EMPTY_STAT}
              onPress={() =>
                router.push(`/d/analytics-customers?range=${range}`)
              }
            />
          </View>

          {/* Revenue chart section */}
          <TouchableOpacity
            style={styles.chartCard}
            activeOpacity={0.85}
            onPress={() => router.push(`/d/analytics-revenue?range=${range}`)}
          >
            <View style={styles.chartCardHeader}>
              <AppText style={styles.chartCardTitle}>Revenue</AppText>
              <View style={styles.chartCardHeaderRight}>
                <TrendBadge
                  direction={stats.totalSales?.direction ?? "neutral"}
                  change={stats.totalSales?.change ?? null}
                />
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={Colors.text.muted}
                />
              </View>
            </View>
            <AppText style={styles.chartCardValue}>
              {formatRupiah(stats.totalSales?.current ?? 0)}
            </AppText>
            <AppText style={styles.chartCardPeriod}>{getRangeLabel(range)}</AppText>
            {charts?.revenue ? (
              <View style={styles.chartWrap}>
                <BarChart data={charts.revenue} />
              </View>
            ) : null}
          </TouchableOpacity>

          {/* Customers chart section */}
          <TouchableOpacity
            style={styles.chartCard}
            activeOpacity={0.85}
            onPress={() => router.push(`/d/analytics-customers?range=${range}`)}
          >
            <View style={styles.chartCardHeader}>
              <AppText style={styles.chartCardTitle}>Customers</AppText>
              <View style={styles.chartCardHeaderRight}>
                <TrendBadge
                  direction={stats.totalCustomers?.direction ?? "neutral"}
                  change={stats.totalCustomers?.change ?? null}
                />
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={Colors.text.muted}
                />
              </View>
            </View>
            <AppText style={styles.chartCardValue}>
              {stats.totalCustomers?.current ?? 0}
            </AppText>
            <AppText style={styles.chartCardPeriod}>{getRangeLabel(range)}</AppText>
            {charts?.customers ? (
              <View style={styles.chartWrap}>
                <BarChart
                  data={charts.customers}
                  barColor={Colors.status.info}
                />
              </View>
            ) : null}
          </TouchableOpacity>

          {/* Highlights */}
          {highlights && (highlights.topBarber || highlights.topService) ? (
            <View style={styles.highlightsSection}>
              <View style={styles.sectionRow}>
                <AppText style={styles.sectionTitle}>Highlights</AppText>
              </View>
              {highlights.topBarber ? (
                <HighlightRow
                  imageUrl={highlights.topBarber.imageUrl}
                  name={highlights.topBarber.name}
                  subtitle={`Top barber · ${highlights.topBarber.count} cuts`}
                  revenue={highlights.topBarber.revenue}
                  onPress={() =>
                    router.push(`/d/analytics-barbers?range=${range}`)
                  }
                  fallbackIcon="person"
                />
              ) : null}
              {highlights.topService ? (
                <HighlightRow
                  imageUrl={highlights.topService.imageUrl}
                  name={highlights.topService.name}
                  subtitle={`Top service · ${highlights.topService.count} books`}
                  revenue={highlights.topService.revenue}
                  onPress={() =>
                    router.push(`/d/analytics-services?range=${range}`)
                  }
                  fallbackIcon="cut"
                />
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}
    </ScreenShell>
    </Permission>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  topBar: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  statGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statGridGap: {
    marginTop: 10,
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
    marginBottom: 4,
  },
  chartCardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  chartCardValue: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  chartCardPeriod: {
    fontSize: 12,
    color: Colors.text.muted,
    marginBottom: 14,
    marginTop: 2,
    textTransform: "capitalize",
  },
  chartWrap: {
    marginTop: 4,
  },
  highlightsSection: {
    marginTop: 14,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
