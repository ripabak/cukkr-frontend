import { ScreenShell } from "@/src/components/ScreenShell";
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
          onPress={() => router.push("/switch-barbershop" as any)}
        />
        <TouchableOpacity
          style={styles.notifCircle}
          onPress={() => router.push("/notifications-list" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.greetingRow}>
        <View style={styles.avatar} />
        <View style={styles.greetingText}>
          <Text style={styles.greetingSmall}>{getGreeting()}</Text>
          <Text style={styles.greetingName}>{user?.name ?? "..."}</Text>
        </View>
      </View>

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
                  <ActivityIndicator size="small" color="#666666" />
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
                  color="#1A1A1A"
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
              <ActivityIndicator size="small" color="#1A1A1A" />
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
            icon={<Ionicons name="people" size={18} color="#1A1A1A" />}
            style={styles.metricFlex}
          />
          <MetricCard
            label="Appoint."
            value={String(summary?.appointment ?? 0)}
            icon={<Ionicons name="calendar" size={18} color="#1A1A1A" />}
            style={styles.metricFlex}
          />
        </View>
        <View style={[styles.metricsRow, styles.metricsRowTop]}>
          <MetricCard
            label="In Progress"
            value={String(summary?.inProgress ?? 0)}
            accentColor="#2196F3"
            style={styles.metricFlex}
          />
          <MetricCard
            label="Waiting"
            value={String(summary?.waiting ?? 0)}
            accentColor="#FF9800"
            style={styles.metricFlex}
          />
        </View>
      </View>

      <View style={styles.shortcutsCard}>
        <ShortcutTile
          label="Barbers"
          icon={<Ionicons name="people" size={24} color="#1A1A1A" />}
          onPress={() => router.push("/barbers-management" as any)}
        />
        <ShortcutTile
          label="Customers"
          icon={<Ionicons name="person" size={24} color="#1A1A1A" />}
          onPress={() => router.push("/customer-management" as any)}
        />
        <ShortcutTile
          label="Services"
          icon={<Ionicons name="cut" size={24} color="#1A1A1A" />}
          onPress={() => router.push("/services-management" as any)}
        />
      </View>

      <View style={styles.upcomingRow}>
        <Text style={styles.recentLabel}>Upcoming</Text>
        <TouchableOpacity
          onPress={() => router.push("/schedule" as any)}
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
    borderColor: "#E0DDD0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },
  greetingText: {
    flexDirection: "column",
  },
  greetingSmall: {
    fontSize: 13,
    color: "#666666",
  },
  greetingName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  pinCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  pinLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    letterSpacing: 4,
  },
  regenerateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0DDD0",
    minWidth: 90,
    alignItems: "center",
  },
  regenerateBtnText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  generateBtn: {
    backgroundColor: "#C6FF4D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  generateBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#C6FF4D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  linkText: {
    fontSize: 13,
    color: "#1A1A1A",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7D7D7D",
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
    color: "#1A1A1A",
  },
  emptyText: {
    fontSize: 13,
    color: "#999999",
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
