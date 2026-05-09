import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }} edges={['top']}>
      <View className="flex-1 bg-[#F5F4E8]">
        <View className="flex-row items-center px-[20px] py-md gap-md">
          <TouchableOpacity className="w-9 h-9 rounded-full bg-card items-center justify-center" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text className="flex-1 text-[16px] font-bold text-dark text-center">Customer Details</Text>
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-dark items-center justify-center"
            onPress={() => router.push('/send-messages-to-customers' as never)}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <Text className="text-[30px] font-extrabold text-dark mt-sm">Ethan James</Text>
          <Text className="text-[14px] text-[#555555] mt-[4px] mb-lg">
            +6289283746464{isVerified ? ' (verified)' : ''}
          </Text>

          <SegmentedTabs
            tabs={DETAIL_TABS}
            activeKey={activeTab}
            onTabPress={setActiveTab}
            style={{ marginBottom: 20 }}
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
    <View className="gap-md">
      <View className="flex-row gap-md">
        <StatCard label="Book Value" value="Rp. 500,000" style={{ flex: 1 }} />
        <StatCard label="Books" value="5" style={{ flex: 1 }} />
      </View>
      <View className="flex-row gap-md">
        <StatCard
          label="Walk-In"
          value="2"
          iconName="people"
          iconColor="#C6ED3C"
          style={{ flex: 1 }}
        />
        <StatCard
          label="Appoint."
          value="2"
          iconName="calendar"
          iconColor="#C6ED3C"
          style={{ flex: 1 }}
        />
      </View>
      <ChartCard
        title="Book Stats"
        subtitle="avg comeback every 2 month"
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
    <View className="gap-md">
      <View className="flex-row items-center justify-between mb-sm">
        <Text className="text-[20px] font-bold text-dark">
          Booking <Text className="text-[#888888] font-medium">({totalCount})</Text>
        </Text>
        <TouchableOpacity className="flex-row items-center gap-[4px] bg-card px-md py-[6px] rounded-[20px]" onPress={onFilterPress}>
          <Text className="text-[13px] font-medium text-dark capitalize">
            {statusFilter === 'all' ? 'All' : statusFilter}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
      <View className="gap-[10px]">
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
        style={{ top: 36, right: 0 }}
      />
    </View>
  );
}

function MessagesTab({ messages }: { messages: MessageItem[] }) {
  return (
    <View className="gap-md">
      <MessageThread messages={messages} />
    </View>
  );
}

