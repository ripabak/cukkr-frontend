import { AppText } from "@/src/components/AppText";
import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { useI18nContext } from "@/src/lib/i18n/provider";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
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
  const { t } = useI18nContext();
  const selectable = !selectionMode || hasContact;

  return (
    <TouchableOpacity
      onPress={selectable ? onPress : undefined}
      activeOpacity={selectable ? 0.85 : 1}
      style={[
        styles.card,
        Neu.raised(selected ? Colors.bg.default : Colors.bg.surface),
        selected && styles.cardSelected,
        !selectable && styles.cardDisabled,
        style,
      ]}
    >
      <View style={[styles.avatar, selected ? styles.avatarSelected : Neu.inset(Colors.bg.surface, 0.6)]}>
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
          {t("customers.totalBook")} <AppText style={styles.metaBold}>{totalBook}</AppText>
          {"  ·  "}{t("customers.bookValue")}{" "}
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
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.brand.primaryDark,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSelected: {
    backgroundColor: Colors.brand.primary,
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
