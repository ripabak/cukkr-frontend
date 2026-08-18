import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet, ViewStyle, KeyboardTypeOptions } from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";

interface Props {
  prefix: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  editable?: boolean;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: ViewStyle;
}

export function PrefixedInputField({
  prefix,
  value,
  onChangeText,
  placeholder,
  editable,
  label,
  keyboardType,
  style,
}: Props) {
  return (
    <View style={[label ? styles.rowContainer : styles.container, !label && Neu.inset(Colors.bg.surface, 0.6), style]}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <View style={[styles.inputWrapper, !label && styles.inputWrapperFull, Neu.inset(Colors.bg.surface, 0.6)]}>
        <AppText style={styles.prefix}>{prefix}</AppText>
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          editable={editable}
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.secondary,
    minWidth: 72,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapperFull: {
    flex: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
  },
  prefix: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
  },
});
