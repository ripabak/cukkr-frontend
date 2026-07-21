import { Colors } from "@/src/theme/colors";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

interface TriggerProps {
  open: boolean;
  onPress: () => void;
}

interface Props {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  pillStyle?: ViewStyle;
  pillTextStyle?: TextStyle;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
}

export function FilterPicker({
  options,
  selected,
  onSelect,
  pillStyle,
  pillTextStyle,
  renderTrigger,
}: Props) {
  const [open, setOpen] = useState(false);

  const currentColor = options.find((o) => o.value === selected)?.color;

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <View style={styles.wrapper}>
      {renderTrigger ? (
        renderTrigger({ open, onPress: handleToggle })
      ) : (
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.8}
          style={[styles.pill, pillStyle]}
        >
          <AppText
            style={[
              styles.pillLabel,
              currentColor ? { color: currentColor } : undefined,
              pillTextStyle,
            ]}
          >
            {options.find((o) => o.value === selected)?.label ?? ""}
          </AppText>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={14}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      )}

      {open && (
        <>
          <Pressable
            style={styles.backdrop}
            onPress={() => setOpen(false)}
          />
          <View style={styles.dropdown}>
            {options.map((opt, index) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 999,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    gap: 6,
  },
  pillLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  backdrop: {
    position: "absolute",
    top: -10000,
    left: -10000,
    right: -10000,
    bottom: -10000,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 6,
    backgroundColor: Colors.bg.default,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 8,
    minWidth: 160,
    zIndex: 20,
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
  itemTextBold: {
    fontWeight: "700",
  },
});
