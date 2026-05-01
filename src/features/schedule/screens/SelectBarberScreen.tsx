import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SearchInput } from '@/src/components/SearchInput';

interface Barber {
  id: string;
  name: string;
}

const MOCK_BARBERS: Barber[] = [
  { id: '1', name: 'Pepe Julian' },
  { id: '2', name: 'Pepe Julian' },
];

export function SelectBarberScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = MOCK_BARBERS.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Select Barber" onBack={() => router.back()} />
      <View style={styles.content}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.barberRow}
              onPress={() => router.back()}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color="#1A1A1A" />
              </View>
              <Text style={styles.barberName}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    gap: 10,
  },
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CFE57C',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B0ADA0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  barberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  separator: {
    height: 0,
  },
});
