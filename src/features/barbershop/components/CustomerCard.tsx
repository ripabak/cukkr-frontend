import { Colors } from "@/src/theme/colors";
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
  name: string;
  totalBook: number;
  bookValue: string;
  selected?: boolean;
  selectionMode?: boolean;
  hasContact?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CustomerCard({
  name,
  totalBook,
  bookValue,
  selected,
  selectionMode,
  hasContact = true,
  onPress,
  style,
}: Props) {
  const selectable = !selectionMode || hasContact;

  return (
    <TouchableOpacity
      onPress={selectable ? onPress : undefined}
      activeOpacity={selectable ? 0.8 : 1}
      style={[
        styles.card,
        selected && styles.cardSelected,
        !selectable && styles.cardDisabled,
        style,
      ]}
    >
      <View style={[styles.avatar, !hasContact && styles.avatarMuted]}>
        <Ionicons
          name="person"
          size={22}
          color={hasContact ? Colors.text.primary : Colors.icon.muted}
        />
      </View>
      <View style={styles.info}>
        <AppText style={[styles.name, !hasContact && styles.textMuted]}>
          {name}
        </AppText>
        <AppText style={styles.meta}>
          Total Book <AppText style={styles.metaBold}>{totalBook}</AppText>
          {"  ·  "}Book Value{" "}
          <AppText style={styles.metaBold}>{bookValue}</AppText>
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.icon.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.brand.primaryDark,
    backgroundColor: Colors.bg.default,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMuted: {
    backgroundColor: Colors.bg.surface,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  textMuted: {
    color: Colors.text.muted,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  meta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  metaBold: {
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
