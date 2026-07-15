import { Colors } from "@/src/theme/colors";
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
  onPress?: () => void;
  style?: ViewStyle;
}

export function SelectorInput({
  label,
  required,
  placeholder,
  value,
  iconName,
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
        activeOpacity={0.7}
        style={[styles.container, style]}
      >
        {iconName ? (
          <Ionicons
            name={iconName}
            size={18}
            color={Colors.icon.muted}
            style={styles.icon}
          />
        ) : null}
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
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  asterisk: {
    color: Colors.status.danger,
  },
  container: {
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border.default,
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
