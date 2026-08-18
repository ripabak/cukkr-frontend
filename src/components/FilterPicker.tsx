import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
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
  pillStyle?: StyleProp<ViewStyle>;
  pillTextStyle?: StyleProp<TextStyle>;
  renderTrigger?: (props: TriggerProps) => React.ReactNode;
}

/**
 * Pill + dropdown filter.
 *
 * The open dropdown renders inside a transparent `Modal` (own layer) instead of
 * in the scroll flow — so its full-screen backdrop cannot expand the page's
 * scrollable overflow (which previously caused "unlimited" scrolling on web)
 * and the page behind is locked while the menu is open.
 */
export function FilterPicker({
  options,
  selected,
  onSelect,
  pillStyle,
  pillTextStyle,
  renderTrigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const wrapperRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();

  const currentColor = options.find((o) => o.value === selected)?.color;

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  const handleToggle = () => {
    const next = !open;
    if (next && wrapperRef.current) {
      wrapperRef.current.measureInWindow((x, y, w, h) => {
        setAnchor({ x, y, width: w, height: h });
      });
    }
    setOpen(next);
  };

  return (
    <View style={styles.wrapper} ref={wrapperRef} collapsable={false}>
      {renderTrigger ? (
        renderTrigger({ open, onPress: handleToggle })
      ) : (
        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.85}
          style={[styles.pill, Neu.soft(Colors.bg.surface), pillStyle]}
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

      {open && anchor ? (
        <Modal
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setOpen(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.dropdown,
              Neu.float(Colors.bg.surface, 1.2),
              {
                top: anchor.y + anchor.height + 6,
                right: Math.max(12, windowWidth - (anchor.x + anchor.width)),
              },
            ]}
          >
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
        </Modal>
      ) : null}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdown: {
    position: "absolute",
    borderRadius: 16,
    minWidth: 160,
    overflow: "hidden",
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
    fontWeight: "600",
  },
});
