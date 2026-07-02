import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
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
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={18} color={Colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {hideSave ? (
        <View style={styles.placeholder} />
      ) : (
        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.7}
          style={styles.saveButton}
        >
          <Ionicons name="checkmark" size={18} color={Colors.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});
