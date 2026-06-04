import { BookingCard } from "@/src/components/BookingCard";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { useBarbershopCurrent } from "@/src/features/barbershop/hooks";
import { BarbershopSwitcherModal } from "@/src/features/home/components/BarbershopSwitcherModal";
import { NewBookBottomSheet } from "@/src/features/home/components/NewBookBottomSheet";
import { ShortcutTile } from "@/src/features/home/components/ShortcutTile";
import {
  HOME_QUERY_KEYS,
  useBookingSummary,
  useCurrentPin,
  useGenerateWalkInPin,
  useHomeActiveBookings,
  useMyOrgRole,
} from "@/src/features/home/hooks";
import { useUnreadNotificationsCount } from "@/src/features/notifications/hooks";
import { notificationsService } from "@/src/features/notifications/services/notifications.service";
import { pwaNotificationService } from "@/src/services/pwa-notification.service";
import { mapApiStatusToBookingStatus } from "@/src/features/schedule/utils/booking-formatters";
import { useAuthUser } from "@/src/hooks/useAuthUser";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { formatTime12h, toApiDate } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Banner image natural size: 1744 × 614
const BANNER_IMG_RATIO = 1744 / 614;
const TOP_BAR_HEIGHT = 52;
const VISIBLE_BANNER_HEIGHT = 200;
const CARD_BORDER_RADIUS = 28;
const CARD_OVERLAP = 40;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning,";
  if (hour < 18) return "Good Afternoon,";
  return "Good Evening,";
}

const SHORTCUT_COLORS = {
  barbers: { bg: "#fff3e0", icon: "#f59e0b" },
  customers: { bg: "#dbeafe", icon: "#2563eb" },
  services: { bg: "#ede9fe", icon: "#7c3aed" },
  openHours: { bg: "#fce7f3", icon: "#db2777" },
  newBook: { bg: "#dcfce7", icon: "#16a34a" },
};

const STAT_CONFIG = [
  {
    key: "walkIn",
    label: "Walk-In",
    bg: "#fff8e1",
    valueColor: Colors.brand.primaryDark,
  },
  {
    key: "appointment",
    label: "Appoint.",
    bg: "#dbeafe",
    valueColor: "#2563eb",
  },
  {
    key: "inProgress",
    label: "In Progress",
    bg: "#ede9fe",
    valueColor: "#7c3aed",
  },
  {
    key: "waiting",
    label: "Waiting",
    bg: "#fee2e2",
    valueColor: Colors.status.danger,
  },
];

export function HomeDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = toApiDate(new Date());
  const toast = useToast();

  const queryClient = useQueryClient();
  const { user } = useAuthUser();
  const { data: barbershop } = useBarbershopCurrent();
  const { data: summary } = useBookingSummary(today);
  const { data: activeBookings = [] } = useHomeActiveBookings(today);
  const { data: currentPinData } = useCurrentPin();
  const { mutate: generatePin, isPending: isGenerating } =
    useGenerateWalkInPin();
  const { data: activeMember } = useMyOrgRole();
  const { data: unreadCount } = useUnreadNotificationsCount();

  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [newBookVisible, setNewBookVisible] = useState(false);

  // Silently renew push subscription on mount if permission was already granted
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    )
      return;
    pwaNotificationService
      .requestPermission()
      .then(({ subscription }) => {
        if (subscription) {
          notificationsService
            .registerWebPush(
              subscription as {
                endpoint: string;
                keys: { p256dh: string; auth: string };
              },
            )
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);
  const [notifConsentVisible, setNotifConsentVisible] = useState(false);
  const [greetingInteractive, setGreetingInteractive] = useState(true);
  const [bannerSource, setBannerSource] = useState<number>(
    require("@/assets/images/welcome-banner.avif"),
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  const activePin = currentPinData?.pin ?? null;

  const stickyHeaderHeight = insets.top + TOP_BAR_HEIGHT;
  const bannerSectionHeight =
    insets.top + TOP_BAR_HEIGHT + VISIBLE_BANNER_HEIGHT;
  const bannerImgWidth = bannerSectionHeight * BANNER_IMG_RATIO;
  const spacerHeight = bannerSectionHeight - CARD_OVERLAP;

  // Sticky header: transparent → white as user starts scrolling
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, spacerHeight * 0.35],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Logo crossfade: dark → brand yellow, in sync with the header background
  const logoDarkOpacity = scrollY.interpolate({
    inputRange: [0, spacerHeight * 0.35],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Banner white overlay: fades in behind the content card
  const bannerFadeOpacity = scrollY.interpolate({
    inputRange: [spacerHeight * 0.2, spacerHeight * 0.7],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Greeting: fades out before the card physically reaches it
  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, spacerHeight * 0.25],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const id = greetingOpacity.addListener(({ value }) => {
      setGreetingInteractive(value > 0.01);
    });
    return () => greetingOpacity.removeListener(id);
  }, [greetingOpacity]);

  const handleGeneratePin = () => {
    generatePin(undefined, {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.currentPin }),
    });
  };

  const handleCopyLink = async () => {
    if (!bookingUrl) return;
    await Clipboard.setStringAsync(bookingUrl);
  };

  const bookingUrl = barbershop?.slug
    ? `${process.env.EXPO_PUBLIC_WEB_URL}/${barbershop.slug}`
    : null;

  const todayBookings = activeBookings.slice(0, 5);

  const handleBookingPress = (bookingId: string) => {
    router.push({ pathname: "/d/booking-detail", params: { id: bookingId } });
  };

  const statValues: Record<string, number> = {
    walkIn: summary?.walkIn ?? 0,
    appointment: summary?.appointment ?? 0,
    inProgress: summary?.inProgress ?? 0,
    waiting: summary?.waiting ?? 0,
  };

  const avatarInitials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0].toUpperCase())
        .join("")
    : "?";

  return (
    <View style={styles.root}>
      {/* ── Layer 1: Fixed banner — purely decorative ── */}
      <View style={[styles.bannerSection, { height: bannerSectionHeight }]}>
        <Image
          source={bannerSource}
          onError={() =>
            setBannerSource(require("@/assets/images/welcome-banner.jpg"))
          }
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: bannerSectionHeight,
            width: bannerImgWidth,
          }}
          resizeMode="cover"
        />
        {/* White overlay fades in as card climbs up over the banner */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: Colors.bg.default, opacity: bannerFadeOpacity },
          ]}
        />
      </View>

      {/* ── Layer 2: Transparent ScrollView ── */}
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View style={{ height: spacerHeight }} />

        <View style={[styles.contentCard, { paddingTop: stickyHeaderHeight }]}>
          {/* Walk-In PIN + QR */}
          <View style={styles.checkInRow}>
            <View style={styles.pinCard}>
              <Text style={styles.pinLabel}>Walk-In Check-In</Text>
              <View style={styles.pinValueRow}>
                <Text style={styles.pinValue} numberOfLines={1}>
                  {activePin ?? "----"}
                </Text>
                <TouchableOpacity
                  onPress={handleGeneratePin}
                  disabled={isGenerating}
                  style={styles.pinActionBtn}
                >
                  {isGenerating ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.text.secondary}
                    />
                  ) : (
                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color={Colors.text.secondary}
                    />
                  )}
                </TouchableOpacity>
              </View>
              {bookingUrl && (
                <TouchableOpacity
                  onPress={handleCopyLink}
                  activeOpacity={0.7}
                  style={styles.linkPill}
                >
                  <Text style={styles.linkText} numberOfLines={1}>
                    {bookingUrl}
                  </Text>
                  <Ionicons
                    name="copy-outline"
                    size={14}
                    color={Colors.text.secondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.qrCard}>
              <View style={styles.qrPlaceholder}>
                <Ionicons
                  name="qr-code"
                  size={72}
                  color={Colors.text.primary}
                />
              </View>
              <TouchableOpacity
                style={styles.shareQrBtn}
                activeOpacity={0.85}
                onPress={() => router.push("/d/walkin-qr")}
              >
                <Text style={styles.shareQrText}>Share QR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shortcuts */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.shortcutsRow}
            contentContainerStyle={styles.shortcutsContent}
          >
            <ShortcutTile
              label="New Book"
              iconBg={SHORTCUT_COLORS.newBook.bg}
              icon={
                <Ionicons
                  name="calendar"
                  size={22}
                  color={SHORTCUT_COLORS.newBook.icon}
                />
              }
              onPress={() => setNewBookVisible(true)}
              style={styles.shortcutItem}
            />
            <ShortcutTile
              label="Barbers"
              iconBg={SHORTCUT_COLORS.barbers.bg}
              icon={
                <Ionicons
                  name="people"
                  size={22}
                  color={SHORTCUT_COLORS.barbers.icon}
                />
              }
              onPress={() => router.push("/d/barbers-management")}
              style={styles.shortcutItem}
            />
            <ShortcutTile
              label="Customers"
              iconBg={SHORTCUT_COLORS.customers.bg}
              icon={
                <Ionicons
                  name="person"
                  size={22}
                  color={SHORTCUT_COLORS.customers.icon}
                />
              }
              onPress={() => router.push("/d/customer-management")}
              style={styles.shortcutItem}
            />
            <ShortcutTile
              label="Services"
              iconBg={SHORTCUT_COLORS.services.bg}
              icon={
                <Ionicons
                  name="cut"
                  size={22}
                  color={SHORTCUT_COLORS.services.icon}
                />
              }
              onPress={() => router.push("/d/services-management")}
              style={styles.shortcutItem}
            />
            <ShortcutTile
              label="Open Hours"
              iconBg={SHORTCUT_COLORS.openHours.bg}
              icon={
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={SHORTCUT_COLORS.openHours.icon}
                />
              }
              onPress={() => router.push("/d/open-hours")}
              style={styles.shortcutItem}
            />
          </ScrollView>

          {/* Today's Queue */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Today's Queue</Text>
            <TouchableOpacity onPress={() => router.push("/d/schedule")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {STAT_CONFIG.map((s) => (
              <View
                key={s.key}
                style={[styles.statCard, { backgroundColor: s.bg }]}
              >
                <Text style={[styles.statValue, { color: s.valueColor }]}>
                  {statValues[s.key]}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Today's Booking */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Today's Booking</Text>
            <TouchableOpacity onPress={() => router.push("/d/schedule")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {todayBookings.length > 0 ? (
            todayBookings.map((booking, i) => {
              const timeDate =
                booking.type === "appointment" && booking.scheduledAt
                  ? new Date(booking.scheduledAt as Date)
                  : new Date(booking.createdAt as Date);
              return (
                <BookingCard
                  key={booking.id}
                  customerName={booking.customerName}
                  barberName={booking.barber?.name ?? "—"}
                  timeLabel={formatTime12h(timeDate)}
                  duration={`${booking.totalDuration} mins`}
                  status={mapApiStatusToBookingStatus(booking.status)}
                  bookingType={booking.type}
                  onPress={() => handleBookingPress(booking.id)}
                  style={
                    i < todayBookings.length - 1 ? styles.cardMargin : undefined
                  }
                />
              );
            })
          ) : (
            <Text style={styles.emptyText}>No active bookings today</Text>
          )}
        </View>
      </Animated.ScrollView>

      {/*
        ── Layer 3: Greeting — rendered after ScrollView so it's above the card.
        Fades out before the card physically reaches it, so there's no z-order conflict.
        pointerEvents="box-none" lets scroll gestures pass through the empty area.
      ── */}
      <Animated.View
        style={[
          styles.greetingLayer,
          { top: stickyHeaderHeight + 16, opacity: greetingOpacity },
        ]}
        pointerEvents={greetingInteractive ? "box-none" : "none"}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/d/user-profile")}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{avatarInitials}</Text>
          </View>
          <Text style={styles.greetingSmall}>{getGreeting()}</Text>
          <Text style={styles.greetingName}>{user?.name ?? "..."}</Text>
          {activeMember?.role ? (
            <View style={styles.rolePillContainer}>
              <Text style={styles.rolePill}>{activeMember.role}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </Animated.View>

      {/*
        ── Layer 4: Sticky header — always on top (zIndex: 10).
        Transparent at scroll=0 (banner shows through), fades to white as user scrolls.
        A hairline divider appears with the white background for a clean separation.
      ── */}
      <View
        style={[
          styles.stickyHeader,
          { height: stickyHeaderHeight, paddingTop: insets.top },
        ]}
        pointerEvents="box-none"
      >
        {/* Animated white background with rounded bottom corners and soft shadow */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.headerBg,
            { opacity: headerBgOpacity },
          ]}
        />
        <View style={styles.headerRow} pointerEvents="box-none">
          <View style={styles.logoWrapper}>
            <Animated.Image
              source={require("@/public/cukkr-logo-trans.png")}
              style={[styles.logo, { opacity: headerBgOpacity }]}
              resizeMode="contain"
              tintColor={Colors.brand.primary}
            />
            <Animated.Image
              source={require("@/public/cukkr-logo-trans.png")}
              style={[
                StyleSheet.absoluteFill,
                styles.logo,
                { opacity: logoDarkOpacity },
              ]}
              resizeMode="contain"
              tintColor={Colors.text.primary}
            />
          </View>
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
              color={Colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={async () => {
              if (
                typeof window === "undefined" ||
                !("Notification" in window)
              ) {
                router.push("/d/notifications-list");
                return;
              }
              if (Notification.permission === "denied") {
                router.push("/d/notifications-list");
                return;
              }
              if (Notification.permission === "default") {
                setNotifConsentVisible(true);
                return;
              }
              // Permission already granted — silently renew subscription then navigate
              try {
                const { subscription } =
                  await pwaNotificationService.requestPermission();
                if (subscription) {
                  notificationsService
                    .registerWebPush(
                      subscription as {
                        endpoint: string;
                        keys: { p256dh: string; auth: string };
                      },
                    )
                    .catch(() => {});
                }
                router.push("/d/notifications-list");
              } catch (err) {
                const msg =
                  err instanceof Error
                    ? err.message
                    : "Failed to set up notifications";
                toast.error(msg);
                setTimeout(() => router.push("/d/notifications-list"), 1500);
              }
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={18}
              color={Colors.text.primary}
            />
            {(unreadCount ?? 0) > 0 ? <View style={styles.notifDot} /> : null}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Layer 5: Modal ── */}
      <BarbershopSwitcherModal
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
      />
      <NewBookBottomSheet
        visible={newBookVisible}
        onClose={() => setNewBookVisible(false)}
      />
      <ConfirmationModal
        visible={notifConsentVisible}
        icon="notifications"
        title="Stay Updated"
        description="Get notified about new booking requests and walk-in arrivals in real time."
        cancelLabel="Enable"
        confirmLabel="Not Now"
        onCancel={() => {
          setNotifConsentVisible(false);
          // Defer until after the modal overlay is fully removed from DOM,
          // otherwise some browsers block the native permission dialog.
          setTimeout(async () => {
            try {
              const { subscription } =
                await pwaNotificationService.requestPermission();
              if (subscription) {
                notificationsService
                  .registerWebPush(
                    subscription as {
                      endpoint: string;
                      keys: { p256dh: string; auth: string };
                    },
                  )
                  .catch(() => {});
              }
              router.push("/d/notifications-list");
            } catch (err) {
              const msg =
                err instanceof Error
                  ? err.message
                  : "Failed to set up notifications";
              toast.error(msg);
              // Delay navigation so the toast is visible before screen change
              setTimeout(() => router.push("/d/notifications-list"), 1500);
            }
          }, 300);
        }}
        onConfirm={() => {
          setNotifConsentVisible(false);
          router.push("/d/notifications-list");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.default,
  },

  // Layer 1: Fixed banner behind the scroll (decorative)
  bannerSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.brand.primary,
    overflow: "hidden",
  },

  // Layer 2: ScrollView — transparent so banner shows through spacer
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    backgroundColor: "transparent",
  },
  contentCard: {
    borderTopLeftRadius: CARD_BORDER_RADIUS,
    borderTopRightRadius: CARD_BORDER_RADIUS,
    backgroundColor: Colors.bg.default,
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: 600,
  },

  // Layer 3: Greeting overlay
  greetingLayer: {
    position: "absolute",
    left: 20,
    gap: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.brand.primaryDark,
    letterSpacing: 0.5,
  },
  greetingSmall: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
    fontWeight: "500",
    textShadowColor: "rgba(255,255,255,0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text.primary,
    textShadowColor: "rgba(255,255,255,0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rolePillContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  rolePill: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.brand.primaryDark,
    textTransform: "capitalize",
  },

  // Layer 4: Sticky header
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBg: {
    backgroundColor: Colors.bg.default,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  logoWrapper: {
    width: 26,
    height: 26,
  },
  logo: {
    width: 26,
    height: 26,
  },
  shopSwitcher: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shopName: {
    maxWidth: 120,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  notifBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.danger,
  },

  // Check-in
  checkInRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  pinCard: {
    flex: 1.3,
    backgroundColor: Colors.bg.surface,
    borderRadius: 20,
    padding: 16,
    gap: 4,
  },
  pinLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pinValue: {
    flex: 1,
    fontSize: 38,
    fontWeight: "800",
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
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  qrCard: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  qrPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shareQrBtn: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignSelf: "stretch",
    alignItems: "center",
  },
  shareQrText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text.primary,
  },

  // Shortcuts
  shortcutsRow: {
    marginBottom: 28,
    marginHorizontal: -2,
  },
  shortcutsContent: {
    gap: 4,
    paddingHorizontal: 2,
  },
  shortcutItem: {
    width: 76,
  },

  // Section
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.text.muted,
    textAlign: "center",
  },

  cardMargin: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
