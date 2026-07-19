import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface SortOption {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  options: SortOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  style?: ViewStyle;
}

export function SortMenu({
  visible,
  options,
  selected,
  onSelect,
  onClose,
  style,
}: Props) {
  const { t } = useI18nContext();
  const resolvedOptions = options ?? [
    { label: t("components.sortMenu.sortByName"), value: "name" },
    { label: t("components.sortMenu.sortByLowest"), value: "lowest" },
    { label: t("components.sortMenu.sortByHighest"), value: "highest" },
    { label: t("components.sortMenu.sortByRecent"), value: "recent" },
    { label: t("components.sortMenu.sortByOldest"), value: "oldest" },
  ];
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={[styles.menu, style]}>
        {resolvedOptions.map((opt, index) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => {
              onSelect(opt.value);
              onClose?.();
            }}
            activeOpacity={0.7}
            style={[
              styles.item,
              index < resolvedOptions.length - 1 && styles.itemBorder,
            ]}
          >
            <AppText
              style={[
                styles.itemText,
                selected === opt.value && styles.itemTextSelected,
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

const styles = StyleSheet.create({
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
    backgroundColor: Colors.bg.default,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 8,
    minWidth: 200,
    zIndex: 100,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  itemTextSelected: {
    fontWeight: "700",
    color: Colors.brand.primaryDark,
  },
});
