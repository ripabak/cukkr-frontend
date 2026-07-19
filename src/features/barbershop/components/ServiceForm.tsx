import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { LabeledInput } from "@/src/components/LabeledInput";
import { TextInputField } from "@/src/components/TextInputField";
import { MultilineInputField } from "@/src/components/MultilineInputField";
import { PriceInput } from "@/src/components/PriceInput";
import { ToggleRow } from "@/src/features/barbershop/components/ToggleRow";

interface Props {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  price: string;
  onPriceChange: (v: string) => void;
  duration: string;
  onDurationChange: (v: string) => void;
  isActive: boolean;
  onActiveChange: (v: boolean) => void;
  discount?: string;
  onDiscountChange?: (v: string) => void;
  imageUri?: string;
  onImagePress?: () => void;
  showDiscount?: boolean;
  style?: ViewStyle;
}

export function ServiceForm({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  price,
  onPriceChange,
  duration,
  onDurationChange,
  isActive,
  onActiveChange,
  discount,
  onDiscountChange,
  imageUri,
  onImagePress,
  showDiscount = false,
  style,
}: Props) {
  const { t } = useI18nContext();
  return (
    <View style={[styles.container, style]}>
      <ImageUploadBox
        imageUri={imageUri}
        onPress={onImagePress}
        style={styles.imageBox}
      />

      <TextInputField
        label={t("services.serviceName")}
        placeholder={t("services.namePlaceholder")}
        value={name}
        onChangeText={onNameChange}
        style={styles.field}
      />

      <MultilineInputField
        label={t("services.descriptionLabel")}
        placeholder={t("services.descriptionPlaceholder")}
        value={description}
        onChangeText={onDescriptionChange}
        style={styles.field}
      />

      <PriceInput
        value={price}
        onChangeText={onPriceChange}
        style={styles.prefixField}
      />

      <LabeledInput
        label={t("services.duration")}
        placeholder={t("services.durationPlaceholder")}
        value={duration}
        onChangeText={onDurationChange}
        keyboardType="numeric"
        style={styles.prefixField}
      />

      <View style={styles.card}>
        <ToggleRow
          label={t("services.active")}
          value={isActive}
          onValueChange={onActiveChange}
          isLast
        />
      </View>

      {showDiscount && onDiscountChange ? (
        <LabeledInput
          label={t("services.discount")}
          placeholder="0"
          value={discount ?? ""}
          onChangeText={onDiscountChange}
          keyboardType="numeric"
          style={styles.prefixField}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  imageBox: {
    height: 100,
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  prefixField: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    marginBottom: 16,
  },
});
