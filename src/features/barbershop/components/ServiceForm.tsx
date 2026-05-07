import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ImageUploadBox } from '@/src/components/ImageUploadBox';
import { TextInputField } from '@/src/components/TextInputField';
import { MultilineInputField } from '@/src/components/MultilineInputField';
import { PrefixedInputField } from '@/src/components/PrefixedInputField';
import { ToggleRow } from '@/src/features/barbershop/components/ToggleRow';

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
  return (
    <View style={[styles.container, style]}>
      <ImageUploadBox
        imageUri={imageUri}
        onPress={onImagePress}
        style={styles.imageBox}
      />

      <TextInputField
        label="Name"
        placeholder="Service Name"
        value={name}
        onChangeText={onNameChange}
        style={styles.field}
      />

      <MultilineInputField
        label="Description (Optional)"
        placeholder="Service Description"
        value={description}
        onChangeText={onDescriptionChange}
        style={styles.field}
      />

      <Text style={styles.fieldLabel}>Price</Text>
      <PrefixedInputField
        prefix="Rp"
        placeholder="0"
        value={price}
        onChangeText={onPriceChange}
        style={styles.prefixField}
      />

      <Text style={styles.fieldLabel}>Duration</Text>
      <PrefixedInputField
        prefix="In Minutes"
        placeholder="0"
        value={duration}
        onChangeText={onDurationChange}
        style={styles.prefixField}
      />

      <View style={styles.card}>
        <ToggleRow
          label="Active"
          value={isActive}
          onValueChange={onActiveChange}
          isLast
        />
      </View>

      {showDiscount && onDiscountChange ? (
        <>
          <Text style={styles.fieldLabel}>Discount</Text>
          <PrefixedInputField
            prefix="%"
            placeholder="0"
            value={discount ?? ''}
            onChangeText={onDiscountChange}
            style={styles.prefixField}
          />
        </>
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
  fieldLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
    marginTop: 4,
  },
  prefixField: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#D9E8A0',
    borderRadius: 16,
    marginBottom: 16,
  },
});
