import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
  hideSave?: boolean;
  style?: ViewStyle;
}

export function EditFieldHeader({ title, onBack, onSave, hideSave, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.85}
        style={[styles.backButton, Neu.soft(colors.bg.surface, 0.7)]}
      >
        <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
      </TouchableOpacity>
      <AppText style={styles.title}>{title}</AppText>
      {hideSave ? (
        <View style={styles.placeholder} />
      ) : (
        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.85}
          style={[styles.saveButton, Neu.accent(0.85)]}
        >
          <Ionicons name="checkmark" size={18} color={colors.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "600",
      color: c.text.primary,
      letterSpacing: -0.3,
    },
    saveButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholder: {
      width: 40,
      height: 40,
    },
  });
