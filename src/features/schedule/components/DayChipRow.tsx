import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const DESKTOP_BREAKPOINT = 1024;
const SCROLL_STEP = 228;

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
      onLayout={isDesktop ? handleContainerLayout : undefined}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onScroll={isDesktop ? handleScroll : undefined}
        onContentSizeChange={isDesktop ? handleContentSizeChange : undefined}
        scrollEventThrottle={16}
      >
        {days.map((day) => {
          const isSelected = day.dateKey === selectedKey;
          const hasRequest = !isSelected && highlightDates?.has(day.dateKey);
          const hasWaiting = !isSelected && waitingDates?.has(day.dateKey);
          return (
            <TouchableOpacity
              key={day.dateKey}
              onPress={() => onSelect(day.dateKey)}
              activeOpacity={0.85}
              style={[
                styles.chip,
                Neu.soft(isSelected ? colors.brand.primary : colors.bg.surface, 0.8),
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
      {isDesktop ? [arrowBtn("left"), arrowBtn("right")] : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  wrapper: {
    position: "relative",
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
  },
  dotsRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 4,
  },
  requestDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: c.status.danger,
  },
  waitingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: c.brand.primary,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
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
