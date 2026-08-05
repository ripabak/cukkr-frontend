import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props {
  onPress?: () => void;
  imageUri?: string;
  label?: string;
  style?: ViewStyle;
}

export function ImageUploadBox({ onPress, imageUri, label, style }: Props) {
  const { t } = useI18nContext();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.container, Neu.inset(Colors.bg.surface, 0.6), style]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.row}>
          <Ionicons name="camera-outline" size={20} color={Colors.icon.muted} />
          <AppText style={styles.label}>{label ?? t("createBarbershop.chooseImage")}</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.text.muted,
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
