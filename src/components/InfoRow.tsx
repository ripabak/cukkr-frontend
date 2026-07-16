import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  label: string;
  value?: string;
  valueIconName?: string;
  placeholder?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
}

export function InfoRow({
  label,
  value,
  valueIconName,
  placeholder,
  onPress,
  showChevron,
  isLast,
  multiline,
  style,
}: Props) {
  const displayValue = value || null;
  const displayPlaceholder = !value && placeholder ? placeholder : null;

  const content = (
    <View style={[styles.container, !isLast && styles.borderBottom, style]}>
      <AppText style={styles.label} numberOfLines={1} ellipsizeMode="tail">{label}</AppText>
      {displayValue ? (
        <View style={[styles.valueRow, multiline && styles.valueRowMultiline]}>
          {valueIconName ? (
            <Ionicons
              name={valueIconName as any}
              size={13}
              color={Colors.text.secondary}
            />
          ) : null}
          <AppText
            style={styles.value}
            numberOfLines={multiline ? undefined : 1}
            ellipsizeMode={multiline ? undefined : "head"}
          >
            {displayValue}
          </AppText>
        </View>
      ) : displayPlaceholder ? (
        <AppText style={styles.placeholder} numberOfLines={1} ellipsizeMode="tail">
          {displayPlaceholder}
        </AppText>
      ) : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={Colors.icon.muted} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  label: {
    fontWeight: "700",
    fontSize: 14,
    color: Colors.text.primary,
    flex: 0.5,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 0.5,
    justifyContent: "flex-end",
  },
  valueRowMultiline: {
    alignItems: "flex-start",
  },
  value: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "right",
    flexShrink: 1,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.text.muted,
    flex: 0.5,
    textAlign: "right",
  },
});
