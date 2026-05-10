import { Colors } from '@/src/theme/colors';
import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { StatusBadge } from '@/src/components/StatusBadge';
import { ToggleSwitch } from '@/src/components/ToggleSwitch';

interface Props {
  name: string;
  price: number;
  discountPercent?: number;
  imageUri?: string;
  isDefault?: boolean;
  isActive?: boolean;
  onToggleActive?: (v: boolean) => void;
  style?: ViewStyle;
}

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function ServiceCard({
  name,
  price,
  discountPercent,
  imageUri,
  isDefault,
  isActive = true,
  onToggleActive,
  style,
}: Props) {
  const finalPrice = discountPercent
    ? Math.round(price * (1 - discountPercent / 100))
    : price;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imagePlaceholder}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imageEmpty} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {discountPercent ? (
          <View style={styles.discountRow}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
            <Text style={styles.originalPrice}>{formatPrice(price)}</Text>
          </View>
        ) : null}
        <Text style={styles.finalPrice}>{formatPrice(finalPrice)}</Text>
      </View>
      <View style={styles.right}>
        {isDefault ? (
          <StatusBadge label="Default" variant="default" style={styles.defaultBadge} />
        ) : null}
        {onToggleActive !== undefined ? (
          <ToggleSwitch value={isActive} onValueChange={onToggleActive} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageEmpty: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.brand.primaryDark,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountText: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  defaultBadge: {
    marginBottom: 4,
  },
});
