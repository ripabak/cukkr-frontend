import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WorkspacePill } from '@/src/components/WorkspacePill';
import { MetricCard } from '@/src/components/MetricCard';
import { ShortcutTile } from '@/src/components/ShortcutTile';
import { BottomTabBar } from '@/src/components/BottomTabBar';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';

export function HomeDashboardScreen() {
  const [showPinModal, setShowPinModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <WorkspacePill name="Hendra Barbershop" />
            <View style={styles.notifCircle}>
              <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            </View>
          </View>

          <View style={styles.greetingRow}>
            <View style={styles.avatar} />
            <View style={styles.greetingText}>
              <Text style={styles.greetingSmall}>Good Morning,</Text>
              <Text style={styles.greetingName}>James Comberan</Text>
            </View>
          </View>

          <View style={styles.pinCard}>
            <View style={styles.pinTopRow}>
              <Text style={styles.pinLabel}>Walk-In PIN</Text>
              <Ionicons name="server-outline" size={16} color="#666666" />
            </View>
            <View style={styles.pinValueRow}>
              <Text style={styles.pinValue}>345678</Text>
              <TouchableOpacity onPress={() => setShowPinModal(true)} style={styles.refreshBtn}>
                <Ionicons name="refresh-outline" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
            <View style={styles.linkPill}>
              <Text style={styles.linkText}>cukrr.com/hendra-barbershop</Text>
              <Ionicons name="copy-outline" size={14} color="#1A1A1A" style={styles.copyIcon} />
            </View>
          </View>

          <View style={styles.metricsSection}>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Today's Schedule"
                value="5"
                style={styles.metricFlex}
              />
              <MetricCard
                label="Walk-In"
                value="2"
                icon={<Ionicons name="people" size={16} color="#666666" />}
                style={styles.metricFlex}
              />
              <MetricCard
                label="Appoint."
                value="2"
                icon={<Ionicons name="calendar" size={16} color="#666666" />}
                style={styles.metricFlex}
              />
            </View>
            <View style={[styles.metricsRow, styles.metricsRowTop]}>
              <MetricCard
                label="In Progress"
                value="2"
                accentColor="#2196F3"
                style={styles.metricFlex}
              />
              <MetricCard
                label="Waiting"
                value="3"
                accentColor="#FF9800"
                style={styles.metricFlex}
              />
            </View>
          </View>

          <View style={styles.shortcutsCard}>
            <ShortcutTile
              label="Barbers"
              icon={<Ionicons name="people" size={24} color="#1A1A1A" />}
            />
            <ShortcutTile
              label="Customers"
              icon={<Ionicons name="person" size={24} color="#1A1A1A" />}
            />
            <ShortcutTile
              label="Services"
              icon={<Ionicons name="cut" size={24} color="#1A1A1A" />}
            />
          </View>

          <Text style={styles.recentLabel}>Recent Activity</Text>

          <View style={[styles.activityCard, styles.activityCardTop]}>
            <View style={[styles.activityCircle, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.activityTime}>12m ago</Text>
            <Text style={styles.activityRight}>30 mins</Text>
          </View>

          <View style={[styles.activityCard, styles.activityCardTop]}>
            <View style={[styles.activityCircle, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.activityTime}>12m ago</Text>
            <Text style={styles.activityRight}>Ethan James / 30 mins</Text>
          </View>
        </ScrollView>

        <View style={styles.tabBarWrapper}>
          <BottomTabBar activeTab="home" onTabPress={() => {}} />
        </View>
      </View>

      <ConfirmationModal
        visible={showPinModal}
        title="Reset Walk-In PIN?"
        description="Reset your walk-in PIN to continue creating walk-in bookings securely."
        icon="refresh-outline"
        cancelLabel="No, Not Yet"
        confirmLabel="Yes"
        onCancel={() => setShowPinModal(false)}
        onConfirm={() => setShowPinModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEE0',
  },
  outer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  notifCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0DDD0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    marginRight: 12,
  },
  greetingText: {
    flexDirection: 'column',
  },
  greetingSmall: {
    fontSize: 13,
    color: '#666666',
  },
  greetingName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pinCard: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  pinTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  pinValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pinValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  refreshBtn: {
    marginLeft: 8,
  },
  linkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#C6FF4D',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 13,
    color: '#1A1A1A',
  },
  copyIcon: {
    marginLeft: 8,
  },
  metricsSection: {
    marginTop: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricsRowTop: {
    marginTop: 8,
  },
  metricFlex: {
    flex: 1,
  },
  shortcutsCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
  },
  recentLabel: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityCardTop: {
    marginTop: 8,
  },
  activityCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  activityTime: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  activityRight: {
    fontSize: 13,
    color: '#1A1A1A',
  },
  tabBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#EEEEE0',
  },
});
