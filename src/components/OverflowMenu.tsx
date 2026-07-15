import { Colors } from "@/src/theme/colors";
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
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={[styles.menu, style]}>
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
    minWidth: 180,
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
  itemTextDanger: {
    color: Colors.status.danger,
  },
});
