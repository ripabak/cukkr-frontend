import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type StatusOption = {
  label: string;
  value: string;
  color?: string;
};

interface Props {
  visible: boolean;
  options: StatusOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  style?: ViewStyle;
}

type TFunction = (key: string, params?: Record<string, string>) => string;

export function getScheduleStatusOptions(c: ThemeColors, t: TFunction): StatusOption[] {
  return [
    { label: t("common.all"), value: "all" },
    {
      label: t("schedule.status.requested"),
      value: "requested",
      color: c.status.requested,
    },
    { label: t("schedule.status.waiting"), value: "waiting", color: c.status.waiting },
    {
      label: t("schedule.status.inProgress"),
      value: "in_progress",
      color: c.status.inProgress,
    },
    { label: t("schedule.status.completed"), value: "completed", color: c.status.success },
    { label: t("schedule.status.cancelled"), value: "cancelled", color: c.status.danger },
  ];
}

export function getHistoryStatusOptions(c: ThemeColors, t: TFunction): StatusOption[] {
  return [
    { label: t("common.all"), value: "all" },
    { label: t("schedule.status.completed"), value: "completed", color: c.status.success },
    { label: t("schedule.status.waiting"), value: "waiting", color: c.status.waiting },
    {
      label: t("schedule.status.inProgress"),
      value: "in_progress",
      color: c.status.inProgress,
    },
    { label: t("schedule.status.cancelled"), value: "canceled", color: c.status.danger },
  ];
}

export function StatusFilterMenu({
  visible,
  options,
  selected,
  onSelect,
  onClose,
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={[styles.menu, Neu.float(colors.bg.default, 1.2), style]}>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => {
              onSelect(opt.value);
              onClose?.();
            }}
            activeOpacity={0.7}
            style={[
              styles.item,
              index < options.length - 1 && styles.itemBorder,
            ]}
          >
            <AppText
              style={[
                styles.itemText,
                opt.color ? { color: opt.color } : undefined,
                selected === opt.value && styles.itemTextBold,
              ]}
            >
              {opt.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    menu: {
      position: "absolute",
      top: 56,
      right: 20,
      borderRadius: 16,
      minWidth: 160,
      zIndex: 100,
      overflow: "hidden",
    },
    item: {
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    itemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: c.border.light,
    },
    itemText: {
      fontSize: 14,
      fontWeight: "500",
      color: c.text.primary,
    },
    itemTextBold: {
      fontWeight: "600",
    },
  });
