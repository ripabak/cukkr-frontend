import { ScreenShell } from "@/src/components/ScreenShell";
import {
  ActivityCard,
  RecentActivity,
} from "@/src/features/home/components/ActivityCard";
import { BarbershopSwitcherModal } from "@/src/features/home/components/BarbershopSwitcherModal";
import { ShortcutTile } from "@/src/features/home/components/ShortcutTile";
import {
  useBookingSummary,
  useCurrentBarbershop,
  useGenerateWalkInPin,
  useHomeActiveBookings,
} from "@/src/features/home/hooks";
import { toISODateString } from "@/src/features/schedule/utils/booking-formatters";
import { useAuthUser } from "@/src/hooks/useAuthUser";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
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
  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [workspaceBarHeight, setWorkspaceBarHeight] = useState(0);

  const handleGeneratePin = () => {
    generatePin(undefined, {
      onSuccess: (data) => {
        setGeneratedPin(data.pin);
      },
    });
  };

  const handleCopyLink = async () => {
    if (!bookingUrl) return;
    await Clipboard.setStringAsync(bookingUrl);
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
    ? `${(process.env.EXPO_BASE_URL ?? "").replace(/\/$/, "")}/${barbershop.slug}`
    : null;

  return (
    <>
      <BarbershopSwitcherModal
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        headerHeight={workspaceBarHeight}
      />
    <ScreenShell
      contentStyle={styles.scrollContentPadding}
      headerSlot={
        <TouchableOpacity
          style={styles.workspaceBar}
          activeOpacity={0.7}
          onPress={() => setSwitcherVisible(true)}
          onLayout={(e) => setWorkspaceBarHeight(e.nativeEvent.layout.height)}
        >
          <Ionicons name="storefront-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.workspaceBarName} numberOfLines={1}>
            {barbershop?.name ?? "Loading..."}
          </Text>
          <Ionicons
            name={switcherVisible ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.brand.primaryDark}
          />
        </TouchableOpacity>
      }
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileRow}
          activeOpacity={0.7}
          onPress={() => router.push("/user-profile")}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {user?.name
                ? user.name.split(" ").slice(0, 2).map((w: string) => w[0].toUpperCase()).join("")
                : "?"}
            </Text>
          </View>
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
        <View style={styles.pinValueRow}>
          <Text style={styles.pinValue}>{generatedPin ?? "* * * *"}</Text>
          <TouchableOpacity
            onPress={handleGeneratePin}
            disabled={isGenerating}
            style={styles.pinRefreshBtn}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={Colors.brand.primaryDark} />
            ) : (
              <Ionicons name="refresh-outline" size={22} color={Colors.icon.muted} />
            )}
          </TouchableOpacity>
        </View>
        {bookingUrl && (
          <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7} style={styles.linkPill}>
            <Text style={styles.linkText} numberOfLines={1}>{bookingUrl}</Text>
            <Ionicons
              name="copy-outline"
              size={15}
              color={Colors.brand.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.scheduleCard}>
        <Image
          source={require("@/assets/images/cover-image.png")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={styles.scheduleCardOverlay}>
          <View style={styles.scheduleCardHeader}>
            <Text style={styles.scheduleCardTitle}>Today's Schedule</Text>
            <View style={styles.scheduleTotalBadge}>
              <Text style={styles.scheduleTotalValue}>{summary?.total ?? 0}</Text>
            </View>
          </View>
          <View style={styles.scheduleStatsRow}>
            {[
              { label: "Walk-In", value: summary?.walkIn ?? 0 },
              { label: "Appoint.", value: summary?.appointment ?? 0 },
              { label: "In Progress", value: summary?.inProgress ?? 0 },
              { label: "Waiting", value: summary?.waiting ?? 0 },
            ].map((stat) => (
              <View key={stat.label} style={styles.scheduleStat}>
                <Text style={styles.scheduleStatValue}>{stat.value}</Text>
                <Text style={styles.scheduleStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.shortcutsCard}>
        <ShortcutTile
          label="Barbers"
          icon={<Ionicons name="people" size={24} color="#ffffff" />}
          onPress={() => router.push("/barbers-management")}
        />
        <ShortcutTile
          label="Customers"
          icon={<Ionicons name="person" size={24} color="#ffffff" />}
          onPress={() => router.push("/customer-management")}
        />
        <ShortcutTile
          label="Services"
          icon={<Ionicons name="cut" size={24} color="#ffffff" />}
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
    </>
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
    marginTop: 24,
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
    backgroundColor: Colors.brand.primaryDark,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
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
    marginTop: 24,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
  },
  pinLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pinValue: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.text.primary,
    flex: 1,
    letterSpacing: 6,
  },
  pinRefreshBtn: {
    padding: 6,
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.brand.primaryDark,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: Colors.brand.primaryDark,
    fontWeight: "500",
  },
  scheduleCard: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  scheduleCardOverlay: {
    backgroundColor: "rgba(0,0,0,0.28)",
    padding: 16,
    paddingBottom: 14,
    gap: 14,
  },
  scheduleCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scheduleCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },
  scheduleTotalBadge: {
    backgroundColor: Colors.brand.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scheduleTotalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.inverse,
  },
  scheduleStatsRow: {
    flexDirection: "row",
    gap: 8,
  },
  scheduleStat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    gap: 3,
  },
  scheduleStatValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  scheduleStatLabel: {
    fontSize: 9,
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  shortcutsCard: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
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
