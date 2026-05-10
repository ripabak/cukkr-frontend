import { ScreenShell } from "@/src/components/ScreenShell";
import { Colors } from "@/src/theme/colors";
import {
  ActivityCard,
  RecentActivity,
} from "@/src/features/home/components/ActivityCard";
import { MetricCard } from "@/src/features/home/components/MetricCard";
import { ShortcutTile } from "@/src/features/home/components/ShortcutTile";
import { WorkspacePill } from "@/src/features/home/components/WorkspacePill";
import {
  useBookingSummary,
  useCurrentBarbershop,
  useGenerateWalkInPin,
  useHomeActiveBookings,
} from "@/src/features/home/hooks";
import { toISODateString } from "@/src/features/schedule/utils/booking-formatters";
import { useAuthUser } from "@/src/hooks/useAuthUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning,";
  if (hour < 18) return "Good Afternoon,";
  return "Good Evening,";
}

function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function HomeDashboardScreen() {
  const router = useRouter();
  const today = toISODateString(new Date());

  const { user } = useAuthUser();
  const { data: barbershop } = useCurrentBarbershop();
  const { data: summary } = useBookingSummary(today);
  const { data: activeBookings = [] } = useHomeActiveBookings(today);
  const { mutate: generatePin, isPending: isGenerating } = useGenerateWalkInPin();

  const [generatedPin, setGeneratedPin] = useState<string | null>(null);

  const handleGeneratePin = () => {
    generatePin(undefined, {
      onSuccess: (data) => {
        setGeneratedPin(data.pin);
      },
    });
  };

  const upcomingActivities: RecentActivity[] = activeBookings
    .slice(0, 5)
    .map((booking) => ({
      id: booking.id,
      time: formatTime(booking.scheduledAt ?? booking.createdAt),
      duration: booking.serviceNames.slice(0, 2).join(", ") || "-",
      name: booking.customerName,
      type:
        booking.status === "in_progress" ? "in_progress" : "waiting",
    }));

  const bookingUrl = barbershop?.slug
    ? `cukkr.com/${barbershop.slug}`
    : null;

  return (
    <ScreenShell contentStyle={styles.scrollContentPadding}>
      <View style={styles.topRow}>
        <WorkspacePill
          name={barbershop?.name ?? "Loading..."}
          onPress={() => router.push("/switch-barbershop")}
        />
        <TouchableOpacity
          style={styles.notifCircle}
          onPress={() => router.push("/notifications-list")}
        >
          <Ionicons name="notifications-outline" size={20} color={Colors.icon.muted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.greetingRow}
        activeOpacity={0.7}
        onPress={() => router.push("/user-profile")}
      >
        <View style={styles.avatar} />
        <View style={styles.greetingText}>
          <Text style={styles.greetingSmall}>{getGreeting()}</Text>
          <Text style={styles.greetingName}>{user?.name ?? "..."}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.pinCard}>
        <Text style={styles.pinLabel}>Walk-In PIN</Text>
        {generatedPin ? (
          <>
            <View style={styles.pinValueRow}>
              <Text style={styles.pinValue}>{generatedPin}</Text>
              <TouchableOpacity
                onPress={handleGeneratePin}
                disabled={isGenerating}
                style={styles.regenerateBtn}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color={Colors.icon.muted} />
                ) : (
                  <Text style={styles.regenerateBtnText}>Regenerate</Text>
                )}
              </TouchableOpacity>
            </View>
            {bookingUrl && (
              <View style={styles.linkPill}>
                <Text style={styles.linkText}>{bookingUrl}</Text>
                <Ionicons
                  name="copy-outline"
                  size={14}
                  color={Colors.text.primary}
                  style={styles.copyIcon}
                />
              </View>
            )}
          </>
        ) : (
          <TouchableOpacity
            onPress={handleGeneratePin}
            disabled={isGenerating}
            style={styles.generateBtn}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={Colors.text.primary} />
            ) : (
              <Text style={styles.generateBtnText}>Generate Walk-In PIN</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.metricsSection}>
        <View style={styles.metricsRow}>
          <MetricCard
            label="Today's Schedule"
            value={String(summary?.total ?? 0)}
            style={styles.metricFlex}
          />
          <MetricCard
            label="Walk-In"
            value={String(summary?.walkIn ?? 0)}
            icon={<Ionicons name="people" size={18} color={Colors.icon.muted} />}
            style={styles.metricFlex}
          />
          <MetricCard
            label="Appoint."
            value={String(summary?.appointment ?? 0)}
            icon={<Ionicons name="calendar" size={18} color={Colors.icon.muted} />}
            style={styles.metricFlex}
          />
        </View>
        <View style={[styles.metricsRow, styles.metricsRowTop]}>
          <MetricCard
            label="In Progress"
            value={String(summary?.inProgress ?? 0)}
            accentColor={Colors.status.inProgress}
            style={styles.metricFlex}
          />
          <MetricCard
            label="Waiting"
            value={String(summary?.waiting ?? 0)}
            accentColor={Colors.status.waiting}
            style={styles.metricFlex}
          />
        </View>
      </View>

      <View style={styles.shortcutsCard}>
        <ShortcutTile
          label="Barbers"
          icon={<Ionicons name="people" size={24} color={Colors.icon.muted} />}
          onPress={() => router.push("/barbers-management")}
        />
        <ShortcutTile
          label="Customers"
          icon={<Ionicons name="person" size={24} color={Colors.icon.muted} />}
          onPress={() => router.push("/customer-management")}
        />
        <ShortcutTile
          label="Services"
          icon={<Ionicons name="cut" size={24} color={Colors.icon.muted} />}
          onPress={() => router.push("/services-management")}
        />
      </View>

      <View style={styles.upcomingRow}>
        <Text style={styles.recentLabel}>Upcoming</Text>
        <TouchableOpacity
          onPress={() => router.push("/schedule")}
        >
          <Text style={styles.seeMore}>See more</Text>
        </TouchableOpacity>
      </View>

      {upcomingActivities.length > 0 ? (
        upcomingActivities.map((item) => (
          <ActivityCard key={item.id} item={item} />
        ))
      ) : (
        <Text style={styles.emptyText}>No active bookings today</Text>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  notifCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg.surface,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  greetingText: {
    flexDirection: "column",
  },
  greetingSmall: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  pinCard: {
    marginTop: 20,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pinLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
    flex: 1,
    letterSpacing: 4,
  },
  regenerateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.default,
    minWidth: 90,
    alignItems: "center",
  },
  regenerateBtnText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  generateBtn: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  generateBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.brand.primary,
  },
  linkText: {
    fontSize: 13,
    color: Colors.brand.primaryDark,
    fontWeight: "500",
  },
  copyIcon: {
    marginLeft: 8,
  },
  metricsSection: {
    marginTop: 16,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricsRowTop: {
    marginTop: 8,
  },
  metricFlex: {
    flex: 1,
  },
  shortcutsCard: {
    marginTop: 16,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  upcomingRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 4,
  },
  scrollContentPadding: {
    paddingBottom: 100,
  },
  seeMore: {
    fontSize: 13,
    color: Colors.brand.primaryDark,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
