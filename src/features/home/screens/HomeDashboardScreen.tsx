import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import { BarbershopSwitcherModal } from "@/src/features/home/components/BarbershopSwitcherModal";
import { ShortcutTile } from "@/src/features/home/components/ShortcutTile";
import {
  HOME_QUERY_KEYS,
  useBookingSummary,
  useCurrentBarbershop,
  useCurrentPin,
  useGenerateWalkInPin,
  useHomeActiveBookings,
} from "@/src/features/home/hooks";
import {
  formatScheduledTime,
  getDetailRouteForStatus,
  mapApiStatusToBookingStatus,
  toISODateString,
} from "@/src/features/schedule/utils/booking-formatters";
import { useAuthUser } from "@/src/hooks/useAuthUser";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
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

function formatDisplayDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

export function HomeDashboardScreen() {
  const router = useRouter();
  const today = toISODateString(new Date());

  const queryClient = useQueryClient();
  const { user } = useAuthUser();
  const { data: barbershop } = useCurrentBarbershop();
  const { data: summary } = useBookingSummary(today);
  const { data: activeBookings = [] } = useHomeActiveBookings(today);
  const { data: currentPinData } = useCurrentPin();
  const { mutate: generatePin, isPending: isGenerating } = useGenerateWalkInPin();

  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);


  const activePin = currentPinData?.pin ?? null;

  const handleGeneratePin = () => {
    generatePin(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.currentPin }),
    });
  };

  const handleCopyPin = async () => {
    if (!activePin) return;
    await Clipboard.setStringAsync(activePin);
  };

  const handleCopyLink = async () => {
    if (!bookingUrl) return;
    await Clipboard.setStringAsync(bookingUrl);
  };

  const bookingUrl = barbershop?.slug
    ? `${(process.env.EXPO_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/${barbershop.slug}`
    : null;

  const todayBookings = activeBookings.slice(0, 5);

  const handleBookingPress = (bookingId: string, status: string) => {
    const route = getDetailRouteForStatus(status);
    router.push({ pathname: route, params: { id: bookingId } });
  };

  const queueStats = [
    { label: "Walk-In", value: summary?.walkIn ?? 0, color: Colors.text.primary },
    { label: "Appoint.", value: summary?.appointment ?? 0, color: Colors.text.primary },
    { label: "In Progress", value: summary?.inProgress ?? 0, color: Colors.status.inProgress },
    { label: "Waiting", value: summary?.waiting ?? 0, color: Colors.status.waiting },
  ];

  return (
    <>
      <BarbershopSwitcherModal
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        headerHeight={topBarHeight}
      />
      <ScreenShell
        contentStyle={styles.scrollContent}
        headerSlot={
          <View
            style={styles.topBar}
            onLayout={(e) => setTopBarHeight(e.nativeEvent.layout.height)}
          >
              <TouchableOpacity
                style={styles.shopSwitcher}
                activeOpacity={0.7}
                onPress={() => setSwitcherVisible(true)}
              >
                <Text style={styles.shopName} numberOfLines={1}>
                  {barbershop?.name ?? "..."}
                </Text>
                <Ionicons
                  name={switcherVisible ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notifBtn}
                onPress={() => router.push("/notifications-list")}
              >
                <Ionicons name="notifications-outline" size={18} color={Colors.text.secondary} />
              </TouchableOpacity>
          </View>
        }
      >
        {/* Profile row */}
        <View style={styles.profileRow}>
          <TouchableOpacity
            style={styles.profileLeft}
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
            <View>
              <Text style={styles.greetingSmall}>{getGreeting()}</Text>
              <Text style={styles.greetingName}>{user?.name ?? "..."}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.datePill}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <View>
              <Text style={styles.datePillLabel}>Today</Text>
              <Text style={styles.datePillDate}>{formatDisplayDate(new Date())}</Text>
            </View>
          </View>
        </View>

        {/* Walk-In PIN + QR side by side */}
        <View style={styles.checkInRow}>
          <View style={styles.pinCard}>
            <Text style={styles.pinLabel}>Walk-In Check-In</Text>
            <View style={styles.pinValueRow}>
              <Text style={styles.pinValue} numberOfLines={1}>{activePin ?? "----"}</Text>
              <TouchableOpacity onPress={handleGeneratePin} disabled={isGenerating} style={styles.pinActionBtn}>
                {isGenerating ? (
                  <ActivityIndicator size="small" color={Colors.text.secondary} />
                ) : (
                  <Ionicons name="refresh-outline" size={20} color={Colors.text.secondary} />
                )}
              </TouchableOpacity>
            </View>
            {bookingUrl && (
              <TouchableOpacity onPress={handleCopyLink} activeOpacity={0.7} style={styles.linkPill}>
                <Text style={styles.linkText} numberOfLines={1}>{bookingUrl}</Text>
                <Ionicons name="copy-outline" size={14} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.qrCard}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={72} color={Colors.text.primary} />
            </View>
            <TouchableOpacity style={styles.shareQrBtn} activeOpacity={0.8} onPress={() => router.push("/walkin-qr")}>
              <Text style={styles.shareQrText}>Share QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shortcuts */}
        <View style={styles.shortcutsRow}>
          <ShortcutTile
            label="Barbers"
            icon={<Ionicons name="people" size={22} color={Colors.text.primary} />}
            onPress={() => router.push("/barbers-management")}
          />
          <ShortcutTile
            label="Customers"
            icon={<Ionicons name="person" size={22} color={Colors.text.primary} />}
            onPress={() => router.push("/customer-management")}
          />
          <ShortcutTile
            label="Services"
            icon={<Ionicons name="cut" size={22} color={Colors.text.primary} />}
            onPress={() => router.push("/services-management")}
          />
          <ShortcutTile
            label="New Book"
            icon={<Ionicons name="calendar" size={22} color={Colors.text.primary} />}
            onPress={() => router.push("/new-walk-in")}
          />
        </View>

        {/* Today's Queue */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's Queue</Text>
          <TouchableOpacity onPress={() => router.push("/schedule")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {queueStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>



        {/* Today's Booking */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's Booking</Text>
          <TouchableOpacity onPress={() => router.push("/schedule")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {todayBookings.length > 0 ? (
          todayBookings.map((booking, i) => {
            const timeRef = booking.type === "appointment" && booking.scheduledAt
              ? booking.scheduledAt
              : booking.createdAt;
            return (
              <BookingCard
                key={booking.id}
                customerName={booking.customerName}
                barberName={booking.barber?.name ?? "—"}
                timeLabel={formatScheduledTime(timeRef)}
                duration="30 mins"
                status={mapApiStatusToBookingStatus(booking.status)}
                bookingType={booking.type}
                onPress={() => handleBookingPress(booking.id, booking.status)}
                style={i < todayBookings.length - 1 ? styles.cardMargin : undefined}
              />
            );
          })
        ) : (
          <Text style={styles.emptyText}>No active bookings today</Text>
        )}
      </ScreenShell>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },

  // Header / top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.bg.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    gap: 12,
  },
  shopSwitcher: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shopName: {
    maxWidth: 180,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },

  // Profile row
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brand.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
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
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.bg.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  datePillLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  datePillDate: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },

  // Check-In row (PIN + QR)
  checkInRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  pinCard: {
    flex: 1.3,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  pinLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pinValue: {
    flex: 1,
    fontSize: 40,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: 6,
  },
  pinActionBtn: {
    padding: 4,
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: Colors.bg.default,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border.default,
    gap: 6,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  qrCard: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  qrPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shareQrBtn: {
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    borderRadius: 10,
    paddingVertical: 8,
    alignSelf: "stretch",
    alignItems: "center",
  },
  shareQrText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },

  // Section header
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.text.muted,
    fontWeight: "500",
  },

  // Queue stats
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bg.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "500",
    color: Colors.text.muted,
    textAlign: "center",
  },

  // Shortcuts
  shortcutsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 4,
  },

  cardMargin: {
    marginBottom: 12,
  },

  // Empty state
  emptyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
