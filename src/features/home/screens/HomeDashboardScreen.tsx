import { BookingCard } from "@/src/components/BookingCard";
import { Skeleton } from "@/src/components/Skeleton";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { AppText } from "@/src/components/AppText";
import { useBarbershopCurrent } from "@/src/features/barbershop/hooks";
import { BarbershopSwitcherModal } from "@/src/features/home/components/BarbershopSwitcherModal";
import { NewBookBottomSheet } from "@/src/components/NewBookBottomSheet";
import { ShortcutTile } from "@/src/features/home/components/ShortcutTile";
import {
  HOME_QUERY_KEYS,
  useBookingSummary,
  useCurrentPin,
  useGenerateWalkInPin,
  useHomeActiveBookings,
} from "@/src/features/home/hooks";
import { useOpenHours } from "@/src/hooks/useOpenHours";
import { useUnreadNotificationsCount } from "@/src/features/notifications/hooks";
import { useUnreadCountByOrg } from "@/src/features/notifications/hooks/useNotificationsQueries";
import { notificationsService } from "@/src/features/notifications/services/notifications.service";
import { pwaNotificationService } from "@/src/services/pwa-notification.service";
import { mapApiStatusToBookingStatus } from "@/src/features/schedule/utils/booking-formatters";
import { useRequestedBookings } from "@/src/features/schedule/hooks";
import { useMemberRole } from "@/src/hooks";
import { usePwaTheme } from "@/src/hooks/usePwaTheme";
import { authClient } from "@/src/lib/auth-client";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { haptics } from "@/src/utils/haptics";
import { formatDateShort, formatTime12h, parseTime24, toApiDate } from "@/src/utils/date";
import { formatTimeRange } from "@/src/utils/time-format";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOP_BAR_HEIGHT = 64;
const OPEN_HOURS_STRIP_HEIGHT = 38;
const OPEN_HOURS_STRIP_MARGIN_TOP = 10;
const OPEN_HOURS_STRIP_MARGIN_BOTTOM = 12;

// Custom quick-action PNG icons (3D-style badge art).
// All tiles share one uniform container background in ShortcutTile.
const QUICK_ICONS = {
  newBooking: require("@/assets/icons/quick-actions/book-new.png"),
  requests: require("@/assets/icons/quick-actions/book-requests.png"),
  barbers: require("@/assets/icons/quick-actions/barbers.png"),
  customers: require("@/assets/icons/quick-actions/customers.png"),
  services: require("@/assets/icons/quick-actions/services.png"),
  openHours: require("@/assets/icons/quick-actions/open-hours.png"),
} as const;

// Same empty-state illustration as the Schedule / Booking Management page.
const NO_BOOKING_PLACEHOLDER = require("@/assets/images/no-booking-placeholder.png");

function getSummaryItems(t: (key: string) => string, c: ThemeColors): {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tint: string;
  surface: string;
}[] {
  return [
    {
      key: "walkIn",
      label: t("home.walkInShort"),
      icon: "walk",
      tint: c.brand.primary,
      surface: c.brand.primarySurface,
    },
    {
      key: "appointment",
      label: t("home.appointShort"),
      icon: "calendar",
      tint: c.brand.primary,
      surface: c.brand.primarySurface,
    },
    {
      key: "waiting",
      label: t("home.waiting"),
      icon: "time",
      tint: c.brand.primary,
      surface: c.brand.primarySurface,
    },
    {
      key: "inProgress",
      label: t("home.inProgress"),
      icon: "cut",
      tint: c.brand.primary,
      surface: c.brand.primarySurface,
    },
  ];
}

/**
 * Compact layout variants for the "Today" summary card.
 * Pick one to preview — flip the value between 1 | 2 | 3:
 *   1 → "bar"   : single row of 4 mini stats, most compact
 *   2 → "grid"  : 2×2 tinted tiles (total shown as a header badge)
 *   3 → "split" : small hero number + 2×2 tiles, tight
 */
type TodayLayout = 1 | 2 | 3;
const TODAY_LAYOUT: TodayLayout = 1;

export function HomeDashboardScreen() {
  const { t } = useI18nContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = toApiDate(new Date());
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const queryClient = useQueryClient();
  const { data: barbershop } = useBarbershopCurrent();
  const { data: summary } = useBookingSummary(today);
  const { data: activeBookings, isLoading: activeBookingsLoading } =
    useHomeActiveBookings(today);
  const nextYear = toApiDate(new Date(Date.now() + 365 * 86400 * 1000));
  const { data: requestsData = [] } = useRequestedBookings(today, nextYear);
  const requestCount = requestsData.length;
  const { data: currentPinData, isLoading: pinLoading } = useCurrentPin();
  const { mutate: generatePin, isPending: isGenerating } =
    useGenerateWalkInPin();
  const { data: unreadCount } = useUnreadNotificationsCount();
  const { data: unreadByOrg = [] } = useUnreadCountByOrg();
  const { data: sessionData } = authClient.useSession();

  const otherOrgHasUnread = unreadByOrg.some(
    (item) =>
      item.organizationId !== sessionData?.session?.activeOrganizationId &&
      item.count > 0,
  );
  const { data: openHoursData } = useOpenHours();

  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [newBookVisible, setNewBookVisible] = useState(false);
  const [notifConsentVisible, setNotifConsentVisible] = useState(false);

  // Keep the PWA status bar / browser chrome tinted with the app background.
  usePwaTheme({ color: colors.bg.default });

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

  const activePin = currentPinData?.pin ?? null;

  const pinAutoGenerated = React.useRef(false);

  useEffect(() => {
    if (
      currentPinData !== undefined &&
      currentPinData.pin === null &&
      !pinAutoGenerated.current &&
      !isGenerating
    ) {
      pinAutoGenerated.current = true;
      generatePin(undefined, {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.currentPin }),
      });
    }
  }, [currentPinData]);

  const stickyHeaderHeight =
    insets.top +
    TOP_BAR_HEIGHT +
    OPEN_HOURS_STRIP_HEIGHT +
    OPEN_HOURS_STRIP_MARGIN_TOP +
    OPEN_HOURS_STRIP_MARGIN_BOTTOM;

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHeaderVisible = useRef(true);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const diff = y - lastScrollY.current;

        if (diff > 10 && y > stickyHeaderHeight && isHeaderVisible.current) {
          isHeaderVisible.current = false;
          Animated.timing(headerTranslateY, {
            toValue: -stickyHeaderHeight,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if ((diff < -5 || y <= 0) && !isHeaderVisible.current) {
          isHeaderVisible.current = true;
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY.current = y;
      },
    },
  );

  // Staggered entrance animation for the page sections.
  const sections = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const didAnimate = useRef(false);

  useEffect(() => {
    if (didAnimate.current) return;
    didAnimate.current = true;
    Animated.stagger(
      70,
      sections.map((s) =>
        Animated.parallel([
          Animated.timing(s, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionStyle = (index: number) => ({
    opacity: sections[index],
    transform: [
      {
        translateY: sections[index].interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  });

  // PIN pulse when a new one is generated.
  const pinScale = useRef(new Animated.Value(1)).current;
  const animatePin = () => {
    pinScale.setValue(0.9);
    Animated.spring(pinScale, {
      toValue: 1,
      stiffness: 320,
      damping: 14,
      useNativeDriver: true,
    }).start();
  };

  const handleGeneratePin = () => {
    haptics.success();
    generatePin(undefined, {
      onSuccess: () => {
        animatePin();
        queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEYS.currentPin });
      },
    });
  };

  const bookingUrl = barbershop?.slug
    ? `${process.env.EXPO_PUBLIC_WEB_URL || "https://cukkr.com"}/${barbershop.slug}`
    : null;

  const timezone =
    barbershop?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const todayOpenHours = React.useMemo(() => {
    const dayMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
    }).formatToParts(new Date());
    const localDay = parts.find((p) => p.type === "weekday")?.value;
    const dayOfWeek = localDay
      ? dayMap[localDay] ?? new Date().getDay()
      : new Date().getDay();
    return openHoursData?.find((d) => d.dayOfWeek === dayOfWeek) ?? null;
  }, [openHoursData, timezone]);

  const isCurrentlyOpen = React.useMemo(() => {
    if (!todayOpenHours || !todayOpenHours.isOpen) return false;
    const open = todayOpenHours.openTime
      ? parseTime24(todayOpenHours.openTime)
      : null;
    const close = todayOpenHours.closeTime
      ? parseTime24(todayOpenHours.closeTime)
      : null;
    if (!open || !close) return false;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    let nowMinutes = 0;
    for (const p of parts) {
      if (p.type === "hour") nowMinutes += parseInt(p.value) * 60;
      else if (p.type === "minute") nowMinutes += parseInt(p.value);
    }
    const openMinutes = open.hour24 * 60 + open.minute;
    const closeMinutes = close.hour24 * 60 + close.minute;
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  }, [todayOpenHours, timezone]);

  const handleShareLink = async () => {
    if (!bookingUrl) return;
    haptics.light();
    const shareData = {
      title: t("home.walkinCheckinTitle"),
      text: t("home.walkinCheckinText"),
      url: bookingUrl,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else {
        await Clipboard.setStringAsync(bookingUrl);
        toast.success(t("home.linkCopied"));
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error(t("home.shareLinkFailed"));
    }
  };

  const handleCopyLink = async () => {
    if (!bookingUrl) return;
    haptics.light();
    try {
      await Clipboard.setStringAsync(bookingUrl);
      toast.success(t("home.linkCopied"));
    } catch {
      toast.error(t("home.shareLinkFailed"));
    }
  };

  const activeBookingsList = activeBookings ?? [];
  const waitingBookings = activeBookingsList
    .filter((b) => b.status === "waiting")
    .slice(0, 2);

  const handleBookingPress = (bookingId: string) => {
    haptics.light();
    router.push({ pathname: "/d/booking-detail", params: { id: bookingId } });
  };

  const statValues: Record<string, number> = {
    walkIn: summary?.walkIn ?? 0,
    appointment: summary?.appointment ?? 0,
    inProgress: summary?.inProgress ?? 0,
    waiting: summary?.waiting ?? 0,
  };
  const totalToday = (summary?.walkIn ?? 0) + (summary?.appointment ?? 0);


  const { role } = useMemberRole();
  const roleLabel =
    role === "owner"
      ? t("barbers.owner")
      : role === "admin"
        ? t("barbers.admin")
        : role === "member"
          ? t("barbers.member")
          : "";

  const SHOP_NAME_MAX = 26;
  const shopDisplayName =
    barbershop?.name && barbershop.name.length > SHOP_NAME_MAX
      ? `${barbershop.name.slice(0, SHOP_NAME_MAX).trimEnd()}…`
      : barbershop?.name ?? "...";

  const shopLogo = barbershop?.logoThumb ?? barbershop?.logoUrl ?? null;
  const shopInitials = barbershop?.name
    ? barbershop.name
        .split(" ")
        .slice(0, 2)
        .filter(Boolean)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "";

  const isOpen = isCurrentlyOpen;

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.page, { paddingTop: stickyHeaderHeight + 20 }]}>
          {/* ===== Z1 → Hero: Today overview (compact, layout-selectable) ===== */}
          <Animated.View style={sectionStyle(0)}>
            <View style={styles.todayCard}>
              <View style={styles.todayHeader}>
                <AppText style={styles.todayEyebrow}>
                  {t("home.todayOverview")}
                </AppText>
                {TODAY_LAYOUT === 2 ? (
                  <View style={styles.totalBadge}>
                    <AppText style={styles.totalBadgeText}>{totalToday}</AppText>
                  </View>
                ) : (
                  <View style={styles.todayDateChip}>
                    <AppText style={styles.todayDate}>
                      {formatDateShort(new Date())}
                    </AppText>
                  </View>
                )}
              </View>

              {!summary ? (
                <Skeleton.StatTiles
                  perRow={4}
                  count={4}
                  height={92}
                  radius={18}
                />
              ) : (
                <>
              {TODAY_LAYOUT === 1 && (
                <View style={styles.statBar}>
                  {getSummaryItems(t, colors).map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.statBarCol}
                      activeOpacity={0.8}
                      onPress={() => {
                        haptics.selection();
                        router.push("/d/schedule");
                      }}
                    >
                      <View
                        style={[
                          styles.statBarIcon,
                          { backgroundColor: item.surface },
                        ]}
                      >
                        <Ionicons name={item.icon} size={15} color={item.tint} />
                      </View>
                      <AppText style={styles.statBarValue}>
                        {statValues[item.key]}
                      </AppText>
                      <AppText style={styles.statBarLabel} numberOfLines={1}>
                        {item.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {TODAY_LAYOUT === 2 && (
                <View style={styles.todayGrid}>
                  {getSummaryItems(t, colors).map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.statTile}
                      activeOpacity={0.8}
                      onPress={() => {
                        haptics.selection();
                        router.push("/d/schedule");
                      }}
                    >
                      <View
                        style={[styles.statChip, { backgroundColor: item.surface }]}
                      >
                        <Ionicons name={item.icon} size={17} color={item.tint} />
                      </View>
                      <AppText style={styles.statValue}>
                        {statValues[item.key]}
                      </AppText>
                      <AppText style={styles.statLabel} numberOfLines={1}>
                        {item.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {TODAY_LAYOUT === 3 && (
                <View style={styles.todayContent}>
                  <View style={styles.todayLeft}>
                    <AppText style={styles.todayTotalSmall}>{totalToday}</AppText>
                    <AppText style={styles.todayCaption}>
                      {t("home.bookingsScheduled")}
                    </AppText>
                  </View>
                  <View style={styles.todayStats}>
                    {getSummaryItems(t, colors).map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={styles.statTile}
                        activeOpacity={0.8}
                        onPress={() => {
                          haptics.selection();
                          router.push("/d/schedule");
                        }}
                      >
                        <View
                          style={[
                            styles.statChip,
                            { backgroundColor: item.surface },
                          ]}
                        >
                          <Ionicons name={item.icon} size={17} color={item.tint} />
                        </View>
                        <AppText style={styles.statValue}>
                          {statValues[item.key]}
                        </AppText>
                        <AppText style={styles.statLabel} numberOfLines={1}>
                          {item.label}
                        </AppText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              </>
              )}
            </View>
          </Animated.View>

          {/* ===== Z2 → Walk-in PIN: primary action ===== */}
          <Animated.View style={[sectionStyle(1), { marginTop: 16 }]}>
            <View style={styles.pinCard}>
              <View style={styles.pinHeader}>
                <View style={styles.pinTitleGroup}>
                  <View style={styles.pinChip}>
                    <Ionicons name="walk" size={20} color={colors.brand.primary} />
                  </View>
                  <View>
                    <AppText style={styles.pinLabel}>{t("home.walkinPin")}</AppText>
                    <AppText style={styles.pinHint} numberOfLines={1}>
                      {t("home.walkinPinHint")}
                    </AppText>
                  </View>
                </View>
                <View style={styles.pinActions}>
                  <TouchableOpacity
                    onPress={handleGeneratePin}
                    disabled={isGenerating}
                    style={styles.pinIconBtn}
                    activeOpacity={0.8}
                  >
                    {isGenerating ? (
                      <ActivityIndicator size="small" color={colors.text.secondary} />
                    ) : (
                      <Ionicons name="refresh" size={18} color={colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      haptics.light();
                      router.push("/d/barbershop-qr");
                    }}
                    style={styles.pinIconBtn}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="qr-code-outline" size={18} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Animated.View
                style={[styles.pinValueRow, { transform: [{ scale: pinScale }] }]}
              >
                {pinLoading ? (
                  <Skeleton width={140} height={42} radius={10} />
                ) : (
                  <AppText style={styles.pinValue} numberOfLines={1}>
                    {activePin ?? "----"}
                  </AppText>
                )}
                <View style={styles.pinActionRow}>
                  <TouchableOpacity
                    onPress={handleCopyLink}
                    disabled={!bookingUrl}
                    style={styles.pinCopyBtn}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="copy-outline" size={18} color={colors.text.primary} />
                    <AppText style={styles.pinCopyLabel}>{t("common.copy")}</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleShareLink}
                    disabled={!bookingUrl}
                    style={styles.pinCopyBtn}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="share-outline" size={18} color={colors.text.primary} />
                    <AppText style={styles.pinCopyLabel}>{t("walkIn.share")}</AppText>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </Animated.View>

          {/* ===== Z3 → Quick actions (horizontal scan) ===== */}
          <Animated.View style={[sectionStyle(2), { marginTop: 22 }]}>
            <View style={styles.quickHeader}>
              <AppText style={styles.sectionTitle}>{t("home.quickActions")}</AppText>
            </View>
            <View style={styles.quickRow}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickScroll}
              >
                <ShortcutTile
                  label={t("home.newBooking")}
                  variant="small"
                  icon={
                    <Image
                      source={QUICK_ICONS.newBooking}
                      style={styles.quickIcon}
                      resizeMode="contain"
                    />
                  }
                  iconBg={colors.bg.cream}
                  onPress={() => setNewBookVisible(true)}
                />
                <ShortcutTile
                  label={t("home.requests")}
                  variant="small"
                  badgeCount={requestCount}
                  dotColor={requestCount > 0 ? colors.status.danger : undefined}
                  icon={
                    <Image
                      source={QUICK_ICONS.requests}
                      style={styles.quickIcon}
                      resizeMode="contain"
                    />
                  }
                  iconBg={colors.bg.cream}
                  onPress={() => router.push("/d/booking-requests")}
                />
                <ShortcutTile
                  label={t("barbers.title")}
                  variant="small"
                  icon={
                    <Image
                      source={QUICK_ICONS.barbers}
                      style={styles.quickIcon}
                      resizeMode="contain"
                    />
                  }
                  iconBg={colors.bg.cream}
                  onPress={() => router.push("/d/barbers-management")}
                />
                <ShortcutTile
                  label={t("customers.title")}
                  variant="small"
                  icon={
                    <Image
                      source={QUICK_ICONS.customers}
                      style={styles.quickIcon}
                      resizeMode="contain"
                    />
                  }
                  iconBg={colors.bg.cream}
                  onPress={() => router.push("/d/customer-management")}
                />
                <ShortcutTile
                  label={t("services.title")}
                  variant="small"
                  icon={
                    <Image
                      source={QUICK_ICONS.services}
                      style={styles.quickIcon}
                      resizeMode="contain"
                    />
                  }
                  iconBg={colors.bg.cream}
                  onPress={() => router.push("/d/services-management")}
                />
                <ShortcutTile
                  label={t("home.openHours")}
                  variant="small"
                  icon={
                    <Image
                      source={QUICK_ICONS.openHours}
                      style={styles.quickIcon}
                      resizeMode="contain"
                    />
                  }
                  iconBg={colors.bg.cream}
                  onPress={() => router.push("/d/open-hours")}
                />
              </Animated.ScrollView>
            </View>
          </Animated.View>

          {/* ===== Z4 → Up next (F-pattern list) ===== */}
          <Animated.View style={[sectionStyle(3), { marginTop: 24 }]}>
            <View style={styles.sectionRow}>
              <AppText style={styles.sectionTitle}>{t("home.upNext")}</AppText>
              <TouchableOpacity
                onPress={() => {
                  haptics.selection();
                  router.push("/d/schedule");
                }}
              >
                <AppText style={styles.seeAll}>{t("home.seeAll")}</AppText>
              </TouchableOpacity>
            </View>
            {activeBookingsLoading ? (
              <View style={{ gap: 12 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton.Card key={i} thumb={48} height={92} radius={20} />
                ))}
              </View>
            ) : waitingBookings.length > 0 ? (
              waitingBookings.map((booking, i) => {
                const timeDate =
                  booking.type === "appointment" && booking.scheduledAt
                    ? new Date(booking.scheduledAt as Date)
                    : new Date(booking.createdAt as Date);
                return (
                  <BookingCard
                    key={booking.id}
                    customerName={booking.customerName}
                    barberName={booking.barber?.name ?? "-"}
                    timeLabel={formatTime12h(timeDate)}
                    duration={`${booking.totalDuration} mins`}
                    status={mapApiStatusToBookingStatus(booking.status)}
                    bookingType={booking.type}
                    onPress={() => handleBookingPress(booking.id)}
                    style={
                      i < waitingBookings.length - 1
                        ? styles.cardMargin
                        : undefined
                    }
                  />
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Image
                  source={NO_BOOKING_PLACEHOLDER}
                  style={styles.emptyImage}
                  resizeMode="cover"
                />
                <AppText style={styles.emptyText}>
                  {t("home.noBookingsToday")}
                </AppText>
              </View>
            )}
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Sticky header — F1 scan line */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            height: stickyHeaderHeight,
            paddingTop: insets.top,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          {/* Workspace switcher — tap anywhere to switch barbershop */}
          <TouchableOpacity
            style={styles.shopWrap}
            activeOpacity={0.85}
            onPress={() => {
              haptics.light();
              setSwitcherVisible(true);
            }}
          >
            <View style={styles.shopDisplay}>
              {shopLogo ? (
                <Image source={{ uri: shopLogo }} style={styles.shopAvatar} />
              ) : (
                <View style={styles.shopAvatarFallback}>
                  <AppText style={styles.shopAvatarInitials} numberOfLines={1}>
                    {shopInitials || "?"}
                  </AppText>
                </View>
              )}
              <View style={styles.shopTextCol}>
                <AppText style={styles.shopName} numberOfLines={1}>
                  {shopDisplayName}
                </AppText>
                {roleLabel ? (
                  <AppText style={styles.shopRole} numberOfLines={1}>
                    {roleLabel}
                  </AppText>
                ) : null}
              </View>
            </View>
            <View style={styles.chevronBtn}>
              <Ionicons
                name="chevron-down"
                size={18}
                color={colors.text.secondary}
              />
              {otherOrgHasUnread ? <View style={styles.shopDot} /> : null}
            </View>
          </TouchableOpacity>

          {/* Notification — center-right */}
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={async () => {
              haptics.light();
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
                    : t("home.notifSetupFailed");
                toast.error(msg);
                setTimeout(() => router.push("/d/notifications-list"), 1500);
              }
            }}
          >
            <Ionicons
              name="notifications"
              size={22}
              color={colors.text.primary}
            />
            {(unreadCount ?? 0) > 0 ? <View style={styles.notifDot} /> : null}
          </TouchableOpacity>

          {/* Profile — far right */}
          <TouchableOpacity
            style={styles.profileBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/d/user-profile")}
          >
            <Ionicons name="person" size={22} color={colors.brand.primary} />
          </TouchableOpacity>
        </View>

        {/* Open/closed status pill */}
        <TouchableOpacity
          style={[
            styles.openHoursStrip,
            isOpen ? styles.openStripOpen : styles.openStripClosed,
          ]}
          activeOpacity={0.9}
          onPress={() => {
            haptics.light();
            router.push("/d/open-hours");
          }}
        >
          <AppText style={styles.openStripStatus}>
            {isOpen ? t("barbershop.open") : t("barbershop.closed")}
          </AppText>
          {todayOpenHours ? (
            <>
              <View style={styles.openStripDivider} />
              <AppText style={styles.openStripRange}>
                {formatTimeRange(
                  todayOpenHours.openTime,
                  todayOpenHours.closeTime,
                )}
              </AppText>
            </>
          ) : null}
          <View style={styles.openStripSpacer} />
          <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Sheets */}
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
        title={t("home.stayUpdated")}
        description={t("home.notifConsentDesc")}
        cancelLabel={t("home.enable")}
        confirmLabel={t("home.notNow")}
        onCancel={() => {
          setNotifConsentVisible(false);
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
                  : t("home.notifSetupFailed");
              toast.error(msg);
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

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.bg.default,
  },

  scroll: {
    flex: 1,
    backgroundColor: c.bg.default,
  },
  scrollContent: {
    backgroundColor: c.bg.default,
  },
  page: {
    backgroundColor: c.bg.default,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  /* Sticky header */
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: c.bg.default,
    zIndex: 10,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  shopWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    justifyContent: "center",
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    borderRadius: 24,
    paddingLeft: 14,
    paddingRight: 6,
  },
  shopDisplay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  shopAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border.light,
  },
  shopAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: c.brand.primarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  shopAvatarInitials: {
    fontSize: 13,
    fontWeight: "700",
    color: c.brand.text,
  },
  shopTextCol: {
    flexShrink: 1,
    gap: 1,
  },
  shopName: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.secondary,
    letterSpacing: -0.2,
  },
  shopRole: {
    fontSize: 12,
    fontWeight: "500",
    color: c.brand.text,
  },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  shopDot: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.status.danger,
    borderWidth: 1.5,
    borderColor: c.bg.surface,
  },
  notifBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: c.status.danger,
    borderWidth: 1.5,
    borderColor: c.bg.surface,
  },

  /* Open status pill */
  openHoursStrip: {
    height: OPEN_HOURS_STRIP_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: OPEN_HOURS_STRIP_MARGIN_TOP,
    marginBottom: OPEN_HOURS_STRIP_MARGIN_BOTTOM,
    borderRadius: 19,
    paddingHorizontal: 14,
  },
  openStripOpen: {
    backgroundColor: c.status.success,
  },
  openStripClosed: {
    backgroundColor: c.status.danger,
  },
  openStripStatus: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  openStripDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 2,
  },
  openStripRange: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  openStripSpacer: {
    flex: 1,
  },

  /* Today hero card — asymmetric split */
  todayCard: {
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    borderRadius: 24,
    padding: 16,
    shadowColor: "rgba(23, 28, 35, 0.06)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3,
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  todayEyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: c.text.secondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  todayDateChip: {
    backgroundColor: c.bg.default,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  todayDate: {
    fontSize: 12,
    fontWeight: "500",
    color: c.text.secondary,
  },
  totalBadge: {
    backgroundColor: c.brand.primarySurface,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: c.brand.primaryDark,
  },

  /* Layout 1 — single-row stat bar (most compact) */
  statBar: {
    flexDirection: "row",
    gap: 8,
  },
  statBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    backgroundColor: c.bg.default,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  statBarIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statBarValue: {
    fontSize: 20,
    fontWeight: "700",
    color: c.text.primary,
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  statBarLabel: {
    fontSize: 10.5,
    fontWeight: "500",
    color: c.text.muted,
    textAlign: "center",
  },

  /* Layout 2 — full-width 2×2 grid */
  todayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  /* Layout 3 — tight split */
  todayContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  todayLeft: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  todayTotalSmall: {
    fontSize: 32,
    fontWeight: "700",
    color: c.text.primary,
    letterSpacing: -1,
    lineHeight: 36,
  },
  todayCaption: {
    fontSize: 12.5,
    fontWeight: "500",
    color: c.text.muted,
  },
  todayStats: {
    flex: 1.1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignContent: "center",
  },
  statTile: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    borderRadius: 18,
    paddingVertical: 11,
    paddingHorizontal: 10,
    gap: 5,
    justifyContent: "center",
  },
  statChip: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: c.text.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: c.text.secondary,
  },

  /* Walk-in PIN card */
  pinCard: {
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    borderRadius: 26,
    padding: 18,
    shadowColor: "rgba(23, 28, 35, 0.06)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3,
  },
  pinHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pinTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  pinChip: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: c.brand.primarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  pinLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.text.primary,
  },
  pinHint: {
    fontSize: 11.5,
    color: c.text.muted,
    marginTop: 1,
  },
  pinActions: {
    flexDirection: "row",
    gap: 8,
  },
  pinIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: c.bg.default,
    borderWidth: 1,
    borderColor: c.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 14,
  },
  pinValue: {
    fontSize: 38,
    fontWeight: "700",
    color: c.brand.text,
    letterSpacing: 5,
    lineHeight: 48,
    flexShrink: 1,
  },
  pinActionRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 2,
  },
  pinCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.default,
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  pinCopyLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: c.text.primary,
  },

  /* Quick actions */
  quickHeader: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: c.text.primary,
    letterSpacing: -0.3,
  },
  quickRow: {
    marginHorizontal: -20,
  },
  quickScroll: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  quickIcon: {
    width: 54,
    height: 54,
  },

  /* Up next */
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  seeAll: {
    fontSize: 13,
    color: c.brand.text,
    fontWeight: "600",
  },
  cardMargin: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13.5,
    color: c.text.muted,
    textAlign: "center",
  },
});
