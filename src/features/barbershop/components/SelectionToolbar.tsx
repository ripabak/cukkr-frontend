import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
        {hasContact !== false ? (
          <TouchableOpacity onPress={onToggleSelect}>
            <Text style={styles.selectText}>
              {selectionMode ? "Cancel" : "Select"}
            </Text>
          </TouchableOpacity>
        ) : null}
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
    width: 36,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.default,
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
});
