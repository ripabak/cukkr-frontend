import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, StyleSheet, View, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label?: string;
  required?: boolean;
  placeholder: string;
  value?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  leftElement?: React.ReactNode;
  onPress?: () => void;
  /** When set and a value exists, renders a clear (×) button before the chevron. */
  onClear?: () => void;
  style?: ViewStyle;
}

export function SelectorInput({
  label,
  required,
  placeholder,
  value,
  iconName,
  leftElement,
  onPress,
  onClear,
  style,
}: Props) {
  return (
    <View>
      {label ? (
        <AppText style={styles.label}>
          {label}
          {required ? <AppText style={styles.asterisk}> *</AppText> : null}
        </AppText>
      ) : null}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.container, Neu.inset(Colors.bg.surface, 0.6), style]}
      >
        {leftElement ?? (iconName ? (
          <Ionicons
            name={iconName}
            size={18}
            color={Colors.icon.muted}
            style={styles.icon}
          />
        ) : null)}
        <AppText
          style={[
            styles.text,
            value ? styles.textFilled : styles.textPlaceholder,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </AppText>
        {onClear && value ? (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={10}
            activeOpacity={0.7}
            style={styles.clearBtn}
          >
            <Ionicons name="close" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        ) : null}
        <Ionicons name="chevron-forward" size={16} color={Colors.icon.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  asterisk: {
    color: Colors.status.danger,
  },
  container: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {},
  text: {
    flex: 1,
    fontSize: 14,
  },
  textPlaceholder: {
    color: Colors.text.muted,
  },
  textFilled: {
    color: Colors.text.primary,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bg.cream,
    alignItems: "center",
    justifyContent: "center",
  },
});
