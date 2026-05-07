import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ServiceItem {
  name: string;
  price: number;
  isDefault?: boolean;
}

interface Props {
  services: ServiceItem[];
  onSelectPress?: () => void;
  style?: ViewStyle;
}

function formatPrice(amount: number): string {
  return `Rp. ${amount.toLocaleString('id-ID')}`;
}

export function ServiceSelectionCard({ services, onSelectPress, style }: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.sectionLabel}>Service</Text>
      {services.length === 0 ? (
        <TouchableOpacity onPress={onSelectPress} activeOpacity={0.7} style={styles.emptyRow}>
          <Ionicons name="add-circle-outline" size={18} color="#B0ADA0" />
          <Text style={styles.emptyText}>Select a service</Text>
        </TouchableOpacity>
      ) : (
        <>
          {services.map((svc, idx) => (
            <View key={idx} style={styles.serviceRow}>
              <View style={styles.imagePlaceholder} />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{svc.name}</Text>
                <Text style={styles.servicePrice}>{formatPrice(svc.price)}</Text>
              </View>
              {svc.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              ) : null}
            </View>
          ))}
          <TouchableOpacity onPress={onSelectPress} activeOpacity={0.7} style={styles.changeRow}>
            <Text style={styles.changeText}>Change service</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#E0DDD0',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#B0ADA0',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CFE57C',
    borderRadius: 12,
    padding: 10,
    gap: 12,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#B0ADA0',
  },
  serviceInfo: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  defaultBadge: {
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  changeRow: {
    alignSelf: 'flex-end',
  },
  changeText: {
    fontSize: 13,
    color: '#666',
    textDecorationLine: 'underline',
  },
});
