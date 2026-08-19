import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  email: string;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function InviteRow({ email, onRemove, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, Neu.inset(colors.bg.surface, 0.6), style]}>
      <View style={styles.dot} />
      <AppText style={styles.email}>{email}</AppText>
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.85}
        style={styles.removeButton}
      >
        <Ionicons name="close" size={14} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.brand.primary,
    },
    email: {
      fontSize: 14,
      color: c.text.primary,
      flex: 1,
      marginLeft: 10,
    },
    removeButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: c.status.dangerSurface,
      alignItems: "center",
      justifyContent: "center",
    },
  });
