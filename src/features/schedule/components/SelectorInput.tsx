import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
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
        style={[styles.container, Neu.inset(colors.bg.surface, 0.6), style]}
      >
        {leftElement ?? (iconName ? (
          <Ionicons
            name={iconName}
            size={18}
            color={colors.icon.muted}
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
            <Ionicons name="close" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        ) : null}
        <Ionicons name="chevron-forward" size={16} color={colors.icon.muted} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: c.text.secondary,
    marginBottom: 6,
  },
  asterisk: {
    color: c.status.danger,
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
    color: c.text.muted,
  },
  textFilled: {
    color: c.text.primary,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: c.bg.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  });
