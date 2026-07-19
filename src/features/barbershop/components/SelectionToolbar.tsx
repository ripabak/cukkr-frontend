import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  selectionMode: boolean;
  onToggleSelect: () => void;
  onFilterPress?: () => void;
  hasContact?: boolean;
  onContactFilterPress?: () => void;
}

export function SelectionToolbar({
  selectionMode,
  onToggleSelect,
  onFilterPress,
  hasContact,
  onContactFilterPress,
}: Props) {
  const { t } = useI18nContext();
  const router = useRouter();

  return (
    <View style={styles.row}>
      {selectionMode ? (
        <View style={styles.spacer} />
      ) : (
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      )}
      <View style={styles.right}>
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <Ionicons name="filter" size={18} color={Colors.text.primary} />
        </TouchableOpacity>
        {onContactFilterPress ? (
          <TouchableOpacity
            style={[
              styles.filterBtn,
              hasContact && styles.filterBtnActive,
            ]}
            onPress={onContactFilterPress}
          >
            <Ionicons
              name={hasContact ? "call" : "call-outline"}
              size={18}
              color={
                hasContact ? Colors.brand.primaryDark : Colors.icon.muted
              }
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={hasContact !== false ? onToggleSelect : undefined}
          activeOpacity={hasContact !== false ? 0.8 : 1}
        >
          <AppText
            style={[
              styles.selectText,
              hasContact === false && styles.selectTextDisabled,
            ]}
          >
            {selectionMode ? t("common.cancel") : t("common.select")}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  spacer: {
    width: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    backgroundColor: Colors.brand.primarySurface,
    borderWidth: 1,
    borderColor: Colors.brand.primaryDark,
  },
  selectText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
    backgroundColor: Colors.bg.default,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectTextDisabled: {
    color: Colors.text.muted,
    opacity: 0.5,
  },
});
