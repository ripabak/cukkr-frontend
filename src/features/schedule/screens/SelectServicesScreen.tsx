import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }}>
      <ScreenHeader
        title="Select Services"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="w-9 h-9 rounded-full bg-dark items-center justify-center"
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />
      <View className="flex-1 p-xl gap-lg">
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search" />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleService(item.id)}
              className="relative"
            >
              <ServiceCard
                name={item.name}
                price={item.price}
                discountPercent={item.discountPercent}
                isDefault={item.isDefault}
              />
              <View
                className="absolute right-[14px] w-6 h-6 items-center justify-center"
                style={{
                  top: '50%',
                  marginTop: -12,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: '#1A1A1A',
                  backgroundColor: selected.has(item.id) ? '#1A1A1A' : '#FFFFFF',
                }}
              >
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
