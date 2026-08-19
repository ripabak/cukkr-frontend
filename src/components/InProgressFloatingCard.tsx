import { useI18nContext } from "@/src/lib/i18n/provider";
import { useThemedStyles } from "@/src/theme/styles";
import type { ThemeColors } from "@/src/theme/ThemeContext";
import { formatTime12h } from "@/src/utils/date";
import { haptics } from "@/src/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { USE_NATIVE_DRIVER } from "@/src/utils/nativeDriver";

interface Props {
  bookingId: string;
  customerName: string;
  startedAt: Date | string | null;
}

function useElapsedTime(startedAt: Date | string | null) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const compute = () => {
      if (!startedAt) return "–";
      const start = new Date(startedAt as string);
      const diffSec = Math.max(
        0,
        Math.floor((Date.now() - start.getTime()) / 1000),
      );
      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    };

    setElapsed(compute());
    const interval = setInterval(() => setElapsed(compute()), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return elapsed;
}

function formatStartTime(date: Date | string | null): string {
  if (!date) return "";
  return formatTime12h(new Date(date as string));
}

export function InProgressFloatingCard({
  bookingId,
  customerName,
  startedAt,
}: Props) {
  const { t } = useI18nContext();
  const router = useRouter();
  const elapsed = useElapsedTime(startedAt);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 850,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const dotOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });
  const shimmerOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  return (
    <TouchableOpacity
      onPress={() => {
        haptics.light();
        router.push({
          pathname: "/d/booking-detail",
          params: { id: bookingId },
        });
      }}
      activeOpacity={0.9}
      style={styles.card}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: shimmerOpacity, backgroundColor: "#fff" },
        ]}
      />

      <View style={styles.left}>
        <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
        <View style={styles.textGroup}>
          <AppText style={styles.label}>{t("schedule.inProgressLabel")}</AppText>
          <AppText style={styles.name} numberOfLines={1}>
            {customerName}
          </AppText>
        </View>
      </View>

      <View style={styles.right}>
        <AppText style={styles.startTime}>{formatStartTime(startedAt)} {t("schedule.nowLabel")}</AppText>
        <View style={styles.elapsedRow}>
          <AppText style={styles.elapsed}>{elapsed}</AppText>
          <Ionicons
            name="chevron-forward"
            size={14}
            color="rgba(255,255,255,0.7)"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden",
      backgroundColor: c.status.inProgress,
      ...Platform.select({
        web: {
          boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
        },
        default: {
          shadowColor: "rgba(59, 130, 246, 0.4)",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 16,
          elevation: 5,
        },
      }),
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: "#fff",
    },
    textGroup: {
      flex: 1,
    },
    label: {
      fontSize: 10,
      fontWeight: "500",
      color: "rgba(255,255,255,0.8)",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 1,
    },
    name: {
      fontSize: 15,
      fontWeight: "600",
      color: "#fff",
    },
    right: {
      alignItems: "flex-end",
      gap: 2,
    },
    startTime: {
      fontSize: 10,
      color: "rgba(255,255,255,0.7)",
    },
    elapsedRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    elapsed: {
      fontSize: 15,
      fontWeight: "600",
      color: "#fff",
      letterSpacing: 0.3,
    },
  });

