import { ScreenShell } from "@/src/components/ScreenShell";
import { Colors } from "@/src/theme/colors";
import {
  ActivityCard,
  RecentActivity,
} from "@/src/features/home/components/ActivityCard";
import { ShortcutTile } from "@/src/features/home/components/ShortcutTile";
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
    <ScreenShell
      contentStyle={styles.scrollContentPadding}
      headerSlot={
        <TouchableOpacity
          style={styles.workspaceBar}
          activeOpacity={0.7}
          onPress={() => router.push("/switch-barbershop")}
        >
          <Ionicons name="storefront-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.workspaceBarName} numberOfLines={1}>
            {barbershop?.name ?? "Loading..."}
          </Text>
          <Ionicons name="chevron-down" size={16} color={Colors.icon.muted} />
        </TouchableOpacity>
      }
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileRow}
          activeOpacity={0.7}
          onPress={() => router.push("/user-profile")}
        >
          <View style={styles.avatar} />
          <View style={styles.greetingText}>
            <Text style={styles.greetingSmall}>{getGreeting()}</Text>
            <Text style={styles.greetingName}>{user?.name ?? "..."}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notifCircle}
          onPress={() => router.push("/notifications-list")}
        >
          <Ionicons name="notifications-outline" size={20} color={Colors.icon.muted} />
        </TouchableOpacity>
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

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary?.inProgress ?? 0}</Text>
          <View style={styles.summaryLabelRow}>
            <View style={[styles.dot, { backgroundColor: Colors.status.inProgress }]} />
            <Text style={styles.summaryLabel}>LIVE</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary?.waiting ?? 0}</Text>
          <View style={styles.summaryLabelRow}>
            <View style={[styles.dot, { backgroundColor: Colors.status.waiting }]} />
            <Text style={styles.summaryLabel}>WAITING</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary?.walkIn ?? 0}</Text>
          <Text style={styles.summaryLabel}>WALK-IN</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary?.appointment ?? 0}</Text>
          <Text style={styles.summaryLabel}>BOOKED</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, styles.summaryValueAccent]}>{summary?.total ?? 0}</Text>
          <Text style={[styles.summaryLabel, styles.summaryLabelAccent]}>TOTAL</Text>
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
  workspaceBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: Colors.bg.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    gap: 10,
  },
  workspaceBarName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  greetingText: {
    flexDirection: "column",
  },
  greetingSmall: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  greetingName: {
    fontSize: 16,
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
  summaryCard: {
    marginTop: 16,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: "hidden",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 10,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  summaryValueAccent: {
    color: Colors.brand.primary,
  },
  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.text.secondary,
    letterSpacing: 0.5,
  },
  summaryLabelAccent: {
    color: Colors.brand.primaryDark,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
