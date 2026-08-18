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
});
