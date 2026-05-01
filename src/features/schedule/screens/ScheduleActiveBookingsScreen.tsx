import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@/src/components/BottomTabBar';
import { DateSelectorPill } from '@/src/components/DateSelectorPill';
import { DayChipRow, DayChip } from '@/src/components/DayChipRow';
import { BookingCard, BookingStatus } from '@/src/components/BookingCard';
import { StatusFilterMenu, SCHEDULE_STATUS_OPTIONS } from '@/src/components/StatusFilterMenu';
import { CalendarModal } from '@/src/components/CalendarModal';

interface Booking {
  id: string;
  customerName: string;
  barberName: string;
  timeLabel: string;
  duration: string;
  status: BookingStatus;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: '1', customerName: 'Ethan James', barberName: 'Pepe Julian', timeLabel: '12m ago', duration: '30 mins', status: 'waiting' },
  { id: '2', customerName: 'Ethan James', barberName: 'Pepe Julian', timeLabel: '12m ago', duration: '30 mins', status: 'in-progress' },
  { id: '3', customerName: 'James Cook', barberName: 'Pepe Julian', timeLabel: '5m ago', duration: '45 mins', status: 'waiting' },
];

function generateDayChips(baseDate: Date): DayChip[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      dayLabel: dayLabels[d.getDay()],
      dayNumber: d.getDate(),
      dateKey: d.toISOString().split('T')[0],
    };
  });
}

function formatDatePill(date: Date): string {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayLabels[date.getDay()]}, ${date.getDate()} ${monthShort[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
}

export function ScheduleActiveBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedKey, setSelectedKey] = useState(today.toISOString().split('T')[0]);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const days = generateDayChips(today);

  const filteredBookings = MOCK_BOOKINGS.filter((b) =>
    statusFilter === 'all' ? true : b.status === statusFilter
  );

  const handleSelectDay = (key: string) => {
    setSelectedKey(key);
    const date = new Date(key);
    setSelectedDate(date);
  };

  const handleCalendarSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedKey(date.toISOString().split('T')[0]);
    setCalendarVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <DateSelectorPill
            label={formatDatePill(selectedDate)}
            onPress={() => setCalendarVisible(true)}
          />
          <View style={styles.topActions}>
            <TouchableOpacity
              onPress={() => setCalendarVisible(true)}
              activeOpacity={0.8}
              style={styles.iconBtn}
            >
              <Ionicons name="calendar" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/schedule-new-appointment' as any)}
              activeOpacity={0.8}
              style={[styles.iconBtn, styles.iconBtnDark]}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day chips */}
        <View style={styles.dayChipsWrapper}>
          <DayChipRow
            days={days}
            selectedKey={selectedKey}
            onSelect={handleSelectDay}
            onShowMore={() => setCalendarVisible(true)}
          />
        </View>

        {/* Bookings list */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Active Booking{' '}
              <Text style={styles.sectionCount}>({filteredBookings.length})</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setFilterMenuVisible(true)}
              activeOpacity={0.8}
              style={styles.filterPill}
            >
              <Text style={styles.filterLabel}>
                {SCHEDULE_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'All'}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {filteredBookings.map((booking, i) => (
              <BookingCard
                key={booking.id}
                customerName={booking.customerName}
                barberName={booking.barberName}
                timeLabel={booking.timeLabel}
                duration={booking.duration}
                status={booking.status}
                onPress={() => router.push(`/booking-detail-waiting` as any)}
                style={i < filteredBookings.length - 1 ? styles.cardMargin : undefined}
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom tab */}
        <View style={styles.tabBarWrapper}>
          <BottomTabBar activeTab="schedule" onTabPress={() => {}} />
        </View>

        {/* Filter menu overlay */}
        {filterMenuVisible ? (
          <View style={styles.menuOverlay}>
            <StatusFilterMenu
              visible
              options={SCHEDULE_STATUS_OPTIONS}
              selected={statusFilter}
              onSelect={setStatusFilter}
              onClose={() => setFilterMenuVisible(false)}
              style={styles.filterMenuPosition}
            />
          </View>
        ) : null}

        {/* Calendar modal */}
        <CalendarModal
          visible={calendarVisible}
          selectedDate={selectedDate}
          onSelect={handleCalendarSelect}
          onClose={() => setCalendarVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  outer: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBtnDark: {
    backgroundColor: '#1A1A1A',
  },
  dayChipsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionCount: {
    fontWeight: '400',
    color: '#666666',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  list: {
    gap: 0,
  },
  cardMargin: {
    marginBottom: 12,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  filterMenuPosition: {
    top: 180,
    right: 20,
  },
});
