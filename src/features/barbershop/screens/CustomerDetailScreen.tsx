import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { StatCard } from '@/src/components/StatCard';
import { ChartCard } from '@/src/components/ChartCard';
import { BookingCard, BookingStatus } from '@/src/components/BookingCard';
import { StatusFilterMenu, SCHEDULE_STATUS_OPTIONS } from '@/src/components/StatusFilterMenu';
import { MessageThread, MessageItem } from '@/src/components/MessageThread';

const DETAIL_TABS = [
  { key: 'general', label: 'General' },
  { key: 'books', label: 'Books' },
  { key: 'messages', label: 'Messages' },
];

interface Booking {
  id: string;
  bookingCode: string;
  dateLabel: string;
  amount: string;
  barberName: string;
  status: BookingStatus;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: '1', bookingCode: 'BOOK-12345', dateLabel: 'Sunday, 11 May 2025 8:30', amount: 'Rp. 40,000', barberName: 'Pepe Julian', status: 'waiting' },
  { id: '2', bookingCode: 'BOOK-12345', dateLabel: 'Sunday, 11 May 2025 8:30', amount: 'Rp. 40,000', barberName: 'Pepe Julian', status: 'in-progress' },
  { id: '3', bookingCode: 'BOOK-12345', dateLabel: 'Sunday, 11 May 2025 8:30', amount: 'Rp. 40,000', barberName: 'Pepe Julian', status: 'completed' },
  { id: '4', bookingCode: 'BOOK-12345', dateLabel: 'Sunday, 11 May 2025 8:30', amount: 'Rp. 40,000', barberName: 'Pepe Julian', status: 'canceled' },
  { id: '5', bookingCode: 'BOOK-12345', dateLabel: 'Sunday, 11 May 2025 8:30', amount: 'Rp. 40,000', barberName: 'Pepe Julian', status: 'requested' },
];

const MOCK_MESSAGES: MessageItem[] = [
  { id: '1', text: 'Sudah 30 Hari Dari Terakhir Kamu Pangkas, Rambutmu Sudah Panjang Tuh, Mumpung Hari Ini Sepu Buruan Booking', timestamp: '30 Dec 2025, 16.47' },
  { id: '2', text: 'Datang Besok, Lagi Diskon', timestamp: '29 Dec 2025, 10.47' },
  { id: '3', text: 'Promo Besok Pagi Hair Cut Basic Discount Sebesar 30%', timestamp: '15 Dec 2025, 12.47' },
];

interface Props {
  defaultTab?: 'general' | 'books' | 'messages';
}

export function CustomerDetailScreen({ defaultTab = 'general' }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [filterVisible, setFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const isVerified = activeTab === 'general';

  const filteredBookings = MOCK_BOOKINGS.filter((b) =>
    statusFilter === 'all' ? true : b.status === statusFilter
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Details</Text>
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => router.push('/send-messages-to-customers' as never)}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.customerName}>Ethan James</Text>
          <Text style={styles.customerPhone}>
            +6289283746464{isVerified ? ' (verified)' : ''}
          </Text>

          <SegmentedTabs
            tabs={DETAIL_TABS}
            activeKey={activeTab}
            onTabPress={setActiveTab}
            style={styles.tabs}
          />

          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'books' && (
            <BooksTab
              bookings={filteredBookings}
              totalCount={MOCK_BOOKINGS.length}
              filterVisible={filterVisible}
              onFilterPress={() => setFilterVisible(true)}
              onFilterClose={() => setFilterVisible(false)}
              statusFilter={statusFilter}
              onStatusSelect={(s) => { setStatusFilter(s); setFilterVisible(false); }}
            />
          )}
          {activeTab === 'messages' && (
            <MessagesTab messages={MOCK_MESSAGES} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function GeneralTab() {
  return (
    <View style={styles.tabContent}>
      <View style={styles.statRow}>
        <StatCard label="Book Value" value="Rp. 500,000" style={styles.statCard} />
        <StatCard label="Books" value="5" style={styles.statCard} />
      </View>
      <View style={styles.statRow}>
        <StatCard
          label="Walk-In"
          value="2"
          iconName="people"
          iconColor="#C6ED3C"
          style={styles.statCard}
        />
        <StatCard
          label="Appoint."
          value="2"
          iconName="calendar"
          iconColor="#C6ED3C"
          style={styles.statCard}
        />
      </View>
      <ChartCard
        title="Book Stats"
        subtitle="avg comeback every 2 month"
        style={styles.chartCard}
      />
    </View>
  );
}

interface BooksTabProps {
  bookings: Booking[];
  totalCount: number;
  filterVisible: boolean;
  onFilterPress: () => void;
  onFilterClose: () => void;
  statusFilter: string;
  onStatusSelect: (s: string) => void;
}

function BooksTab({ bookings, totalCount, filterVisible, onFilterPress, onFilterClose, statusFilter, onStatusSelect }: BooksTabProps) {
  return (
    <View style={styles.tabContent}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle}>
          Booking <Text style={styles.bookingCount}>({totalCount})</Text>
        </Text>
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <Text style={styles.filterBtnText}>
            {statusFilter === 'all' ? 'All' : statusFilter}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
      <View style={styles.bookingList}>
        {bookings.map((b) => (
          <BookingCard
            key={b.id}
            customerName={b.bookingCode}
            barberName={b.barberName}
            timeLabel={b.dateLabel}
            duration={b.amount}
            status={b.status}
          />
        ))}
      </View>
      <StatusFilterMenu
        visible={filterVisible}
        options={SCHEDULE_STATUS_OPTIONS}
        selected={statusFilter}
        onSelect={onStatusSelect}
        onClose={onFilterClose}
        style={styles.statusMenu}
      />
    </View>
  );
}

function MessagesTab({ messages }: { messages: MessageItem[] }) {
  return (
    <View style={styles.tabContent}>
      <MessageThread messages={messages} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  customerName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: '#555555',
    marginTop: 4,
    marginBottom: 16,
  },
  tabs: {
    marginBottom: 20,
  },
  tabContent: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  chartCard: {},
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  bookingCount: {
    color: '#888888',
    fontWeight: '500',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    textTransform: 'capitalize',
  },
  bookingList: {
    gap: 10,
  },
  statusMenu: {
    top: 36,
    right: 0,
  },
});
