import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }}>
      <ScreenHeader title="Select Barber" onBack={() => router.back()} />
      <View className="flex-1 p-xl gap-lg">
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center bg-[#CFE57C] rounded-lg px-lg py-[14px] gap-md"
              onPress={() => router.back()}
            >
              <View className="w-11 h-11 rounded-full bg-light-gray items-center justify-center overflow-hidden">
                <Ionicons name="person" size={22} color="#1A1A1A" />
              </View>
              <Text className="flex-1 text-[15px] font-semibold text-dark">{item.name}</Text>
              <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => null}
        />
      </View>
    </SafeAreaView>
  );
}
