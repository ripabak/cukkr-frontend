import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SearchInput } from '@/src/components/SearchInput';
import { CustomerCard } from '@/src/components/CustomerCard';
import { SelectionToolbar } from '@/src/components/SelectionToolbar';
import { SelectionFooter } from '@/src/components/SelectionFooter';
import { FloatingActionButton } from '@/src/components/FloatingActionButton';
import { SortMenu } from '@/src/components/SortMenu';

interface Customer {
  id: string;
  name: string;
  totalBook: number;
  bookValue: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Pepe Julian', totalBook: 3, bookValue: 'Rp. 120,000' },
  { id: '2', name: 'Ethan James', totalBook: 5, bookValue: 'Rp. 500,000' },
  { id: '3', name: 'Marcus Ruan', totalBook: 2, bookValue: 'Rp. 80,000' },
];

const SORT_OPTIONS = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Total Book', value: 'total_book' },
  { label: 'Sort by Book Value', value: 'book_value' },
  { label: 'Sort by Recently Added', value: 'recent' },
  { label: 'Sort by Oldest First', value: 'oldest' },
];

export function CustomerManagementScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortVisible, setSortVisible] = useState(false);
  const [sortValue, setSortValue] = useState('');

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCardPress(customer: Customer) {
    if (selectionMode) {
      toggleSelect(customer.id);
    } else {
      router.push('/customer-detail-general' as never);
    }
  }

  function handleCancelSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function handleSendPress() {
    router.push('/send-messages-to-customers' as never);
  }

  const bgColor = selectionMode ? '#C6ED3C' : '#F5F4E8';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <SelectionToolbar
          selectionMode={selectionMode}
          onToggleSelect={() => {
            if (selectionMode) {
              handleCancelSelection();
            } else {
              setSelectionMode(true);
            }
          }}
          onFilterPress={() => setSortVisible(true)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Customer{'\n'}Management</Text>
          <Text style={styles.subtitle}>Manage all your customers in one place.</Text>
          {!selectionMode && (
            <Text style={styles.hint}>
              Only Customer with valid contact information will be here.
            </Text>
          )}

          <View style={styles.searchWrapper}>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search"
            />
          </View>

          <View style={styles.list}>
            {filtered.map((customer) => (
              <CustomerCard
                key={customer.id}
                name={customer.name}
                totalBook={customer.totalBook}
                bookValue={customer.bookValue}
                selectionMode={selectionMode}
                selected={selectedIds.has(customer.id)}
                onPress={() => handleCardPress(customer)}
              />
            ))}
          </View>

          {selectionMode && <View style={{ height: 80 }} />}
        </ScrollView>

        {selectionMode && (
          <>
            <SelectionFooter count={selectedIds.size} />
            <FloatingActionButton onPress={handleSendPress} />
          </>
        )}

        <SortMenu
          visible={sortVisible}
          options={SORT_OPTIONS}
          selected={sortValue}
          onSelect={(v) => setSortValue(v)}
          onClose={() => setSortVisible(false)}
          style={styles.sortMenu}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 40,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444444',
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: '#444444',
    marginTop: 4,
  },
  searchWrapper: {
    marginTop: 24,
    marginBottom: 16,
  },
  list: {
    gap: 10,
  },
  sortMenu: {
    top: 52,
    right: 20,
    left: 20,
  },
});
