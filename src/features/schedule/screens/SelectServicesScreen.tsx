import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SearchInput } from '@/src/components/SearchInput';
import { ServiceCard } from '@/src/components/ServiceCard';

interface Service {
  id: string;
  name: string;
  price: number;
  discountPercent?: number;
  isDefault?: boolean;
}

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Hair Cut', price: 40000, isDefault: true },
  { id: '2', name: 'Hair Dyinh', price: 100000, discountPercent: 20 },
];

export function SelectServicesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_SERVICES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Select Services"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={styles.confirmBtn}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search" />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleService(item.id)}
              style={styles.serviceWrapper}
            >
              <ServiceCard
                name={item.name}
                price={item.price}
                discountPercent={item.discountPercent}
                isDefault={item.isDefault}
              />
              <View style={[styles.checkbox, selected.has(item.id) && styles.checkboxSelected]}>
                {selected.has(item.id) ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  list: {
    paddingBottom: 20,
  },
  confirmBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceWrapper: {
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
});
