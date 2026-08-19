import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const DESKTOP_BREAKPOINT = 1024;
const SCROLL_STEP = 228;
/** Same brand glow token used by BottomTabBar, so the edge light matches. */
const BRAND_RGB = "245, 185, 35";
const CHIP_WIDTH = 66;
const CHIP_STEP = 76; // chip width + gap — used to map a day's x to the viewport

export interface DayChip {
  dayLabel: string;
  dayNumber: number;
  dateKey: string;
}

interface Props {
  days: DayChip[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onShowMore?: () => void;
  highlightDates?: Set<string>;
  waitingDates?: Set<string>;
}

export function DayChipRow({
  days,
  selectedKey,
  onSelect,
  onShowMore,
  highlightDates,
  waitingDates,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const isDesktop = Platform.OS === "web" && window.innerWidth >= DESKTOP_BREAKPOINT;

  const canScrollLeft = scrollX > 5;
  const canScrollRight = contentWidth - containerWidth - scrollX > 5;

  const handleScroll = (e: unknown) => {
    const ev = e as { nativeEvent: { contentOffset: { x: number } } };
    setScrollX(ev.nativeEvent.contentOffset.x);
  };

  const handleContentSizeChange = (w: number, _h: number) => {
    setContentWidth(w);
  };

  const handleContainerLayout = (e: unknown) => {
    const ev = e as { nativeEvent: { layout: { width: number } } };
    setContainerWidth(ev.nativeEvent.layout.width);
  };

  const highlightSet =
    highlightDates || waitingDates
      ? new Set([...(highlightDates ?? []), ...(waitingDates ?? [])])
      : null;

  // Brand “cahaya” at an edge only when there's a booking further in that
  // direction; it disappears once nothing is left beyond that edge.
  const leftGlow = highlightSet
    ? days.some(
        (d, i) =>
          highlightSet.has(d.dateKey) && i * CHIP_STEP + CHIP_WIDTH < scrollX + 12,
      )
    : false;
  const rightGlow = highlightSet
    ? days.some(
        (d, i) =>
          highlightSet.has(d.dateKey) &&
          i * CHIP_STEP > scrollX + containerWidth - 12,
      )
    : false;

  // Edge glow(s) breathe in/out so users notice there's more ahead.
  const pulse = useRef(new Animated.Value(0)).current;
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 1],
  });

  useEffect(() => {
    if (!leftGlow && !rightGlow) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    // Heartbeat: fast pop, short echo, then a longer rest — reads clearly as a pulse.
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [leftGlow, rightGlow, pulse]);

  const scrollBy = (direction: "left" | "right") => {
    const amount = direction === "left" ? -SCROLL_STEP : SCROLL_STEP;
    scrollRef.current?.scrollTo({
      x: scrollX + amount,
      y: 0,
      animated: true,
    });
  };

  const arrowBtn = (direction: "left" | "right") => {
    const isLeft = direction === "left";
    const disabled = isLeft ? !canScrollLeft : !canScrollRight;
    return (
      <TouchableOpacity
        key={direction}
        onPress={() => scrollBy(direction)}
        activeOpacity={0.75}
        disabled={disabled}
        style={[
          styles.arrowBtn,
          isLeft ? styles.arrowBtnLeft : styles.arrowBtnRight,
          disabled && styles.arrowBtnDisabled,
        ]}
      >
        <Ionicons
          name={isLeft ? "chevron-back" : "chevron-forward"}
          size={20}
          color={disabled ? colors.icon.muted : colors.text.primary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.wrapper}
      onLayout={handleContainerLayout}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
      >
        {days.map((day) => {
          const isSelected = day.dateKey === selectedKey;
          const hasRequest = highlightDates?.has(day.dateKey);
          const hasWaiting = waitingDates?.has(day.dateKey);
          return (
            <TouchableOpacity
              key={day.dateKey}
              onPress={() => onSelect(day.dateKey)}
              activeOpacity={0.85}
              style={[
                styles.chip,
                Neu.soft(
                  isSelected ? colors.brand.primary : colors.bg.surface,
                  0.8,
                ),
                isSelected && styles.chipSelected,
              ]}
            >
              <AppText
                style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}
              >
                {day.dayLabel.toUpperCase()}
              </AppText>
              <AppText
                style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}
              >
                {day.dayNumber}
              </AppText>
              <View style={styles.dotsRow}>
                {hasRequest ? (
                  <View style={styles.requestDot} />
                ) : (
                  <View style={styles.dotPlaceholder} />
                )}
                {hasWaiting ? (
                  <View style={styles.waitingDot} />
                ) : (
                  <View style={styles.dotPlaceholder} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        {onShowMore ? (
          <TouchableOpacity
            onPress={onShowMore}
            activeOpacity={0.85}
            style={[styles.chip, Neu.soft(colors.bg.surface, 0.6), styles.moreChip]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.icon.muted}
            />
          </TouchableOpacity>
        ) : null}
      </ScrollView>
      {leftGlow ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.glow, styles.glowLeft, { opacity: glowOpacity }]}
        >
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={[
              `rgba(${BRAND_RGB}, 0.30)`,
              `rgba(${BRAND_RGB}, 0.12)`,
              "rgba(255,255,255,0)",
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      ) : null}
      {rightGlow ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            styles.glowRight,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.45, 1],
              }),
            },
          ]}
        >
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={[
              "rgba(255,255,255,0)",
              `rgba(${BRAND_RGB}, 0.12)`,
              `rgba(${BRAND_RGB}, 0.30)`,
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      ) : null}
      {isDesktop ? [arrowBtn("left"), arrowBtn("right")] : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 42,
    zIndex: 5,
  },
  glowLeft: {
    left: 0,
  },
  glowRight: {
    right: 0,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 6,
  },
  chip: {
    width: 66,
    height: 84,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  chipSelected: {
    backgroundColor: c.brand.primary,
  },
  moreChip: {
    backgroundColor: c.bg.surface,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: c.text.muted,
    letterSpacing: 0.5,
  },
  dayLabelSelected: {
    color: c.text.primary,
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: "600",
    color: c.text.primary,
  },
  dayNumberSelected: {
    color: c.text.primary,
    fontWeight: "700",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 4,
  },
  requestDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    // indigo — matches the “requested” booking status color used in badges/cards
    backgroundColor: c.status.requested,
  },
  waitingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    // orange (status.waiting) — visible on both white chips and the soft
    // gold selected chip, unlike brand gold which would vanish on it
    backgroundColor: c.status.waiting,
  },
  dotPlaceholder: {
    width: 7,
    height: 7,
  },
  arrowBtn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  arrowBtnLeft: {
    left: 0,
  },
  arrowBtnRight: {
    right: 0,
  },
  arrowBtnDisabled: {
    opacity: 0,
    pointerEvents: "none",
  },
  });
