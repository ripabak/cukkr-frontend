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

interface MenuItem {
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

interface Props {
  visible: boolean;
  items: MenuItem[];
  onClose?: () => void;
  style?: ViewStyle;
}

export function OverflowMenu({ visible, items, onClose, style }: Props) {
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
      <View style={[styles.menu, Neu.float(colors.bg.surface, 1.2), style]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              item.onPress?.();
              onClose?.();
            }}
            activeOpacity={0.7}
            style={[styles.item, index < items.length - 1 && styles.itemBorder]}
          >
            <AppText
              style={[styles.itemText, item.danger && styles.itemTextDanger]}
            >
              {item.label}
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
      minWidth: 180,
      zIndex: 100,
      overflow: "hidden",
    },
    item: {
      paddingHorizontal: 16,
      paddingVertical: 16,
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
    itemTextDanger: {
      color: c.status.danger,
    },
  });
