import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  DimensionValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { USE_NATIVE_DRIVER } from "@/src/utils/nativeDriver";

/**
 * Shared skeleton primitives — native-feeling loading placeholders.
 *
 * Every block pulses with a soft opacity wave so the whole page "breathes"
 * together instead of showing spinners. Tuned to the active theme's skeleton
 * tones (warm gray, slightly darker than the card surface).
 *
 * Usage:
 *   <Skeleton width={120} height={16} radius={8} />
 *   <Skeleton.Circle size={48} />
 *   <SkeletonRows rows={4} />
 *   <SkeletonCard />            // full-width card (like BookingCard / lists)
 */

const pulse = () => {
  // One shared value per component instance; loops softly.
  const value = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 750,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(value, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value]);
  return value;
};

interface SkeletonProps {
  width?: number | DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 10,
  style,
}: SkeletonProps) {
  const opacity = pulse();
  const styles = useThemedStyles(createStyles);
  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: radius, opacity },
        style,
      ]}
    />
  );
}

/** Round avatar / thumbnail placeholder. */
function Circle({ size = 44 }: { size?: number }) {
  return <SkeletonBlock width={size} height={size} radius={size / 2} />;
}

/**
 * Stack of text lines — the bread-and-butter list placeholder.
 * `firstWidth`/`lastWidth` let the last line sit shorter (native list look).
 */
function Lines({
  lines = 3,
  firstWidth = "58%",
  lineWidth = "92%",
  lastWidth,
  gap = 10,
  height = 14,
}: {
  lines?: number;
  firstWidth?: number | DimensionValue;
  lineWidth?: number | DimensionValue;
  lastWidth?: number | DimensionValue;
  gap?: number;
  height?: number;
}) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          height={height}
          width={i === 0 ? firstWidth : i === lines - 1 && lastWidth ? lastWidth : lineWidth}
        />
      ))}
    </View>
  );
}

/**
 * Full-width card with an optional leading thumbnail + title/subtitle lines —
 * mirrors BookingCard / MemberCard / ServiceCard / row-list entries.
 */
function Card({
  thumb = 52,
  titleLines = 2,
  subtitleWidth = "40%",
  lines = 2,
  height = 92,
  radius = 22,
  style,
}: {
  thumb?: number;
  titleLines?: number;
  subtitleWidth?: DimensionValue;
  lines?: number;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={[
        styles.card,
        { height, borderRadius: radius, padding: 14 },
        style,
      ]}
    >
      {thumb ? <Circle size={thumb} /> : null}
      <View style={styles.cardBody}>
        <Lines
          lines={titleLines}
          firstWidth="70%"
          lineWidth="86%"
          height={13}
          gap={9}
        />
        <SkeletonBlock width={subtitleWidth} height={11} style={{ marginTop: 3 }} />
      </View>
    </View>
  );
}

/** A row of `count` compact stat tiles (like Today summary / analytics grid). */
function StatTiles({
  perRow = 2,
  count = 4,
  height = 104,
  radius = 18,
}: {
  perRow?: number;
  count?: number;
  height?: number;
  radius?: number;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.tilesRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[styles.tile, { width: `${(100 - (perRow - 1) * 2) / perRow}%` as DimensionValue, height, borderRadius: radius }]}
        >
          <SkeletonBlock width={34} height={34} radius={11} />
          <SkeletonBlock width="55%" height={16} />
          <SkeletonBlock width="72%" height={10} />
        </View>
      ))}
    </View>
  );
}

export const Skeleton = Object.assign(SkeletonBlock, {
  Block: SkeletonBlock,
  Circle,
  Lines,
  Card,
  StatTiles,
});

export default Skeleton;

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    block: {
      backgroundColor: c.border.light,
    },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: c.bg.surface,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  tilesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    backgroundColor: c.bg.surface,
    borderWidth: 1,
    borderColor: c.border.light,
    padding: 12,
    gap: 8,
  },
});
