import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { OperationRow } from '@/src/components/OperationRow';
import { DangerButton } from '@/src/components/DangerButton';
import { BottomTabBar } from '@/src/components/BottomTabBar';

export function BarbershopSettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader onBack={() => router.back()} />
          <Text style={styles.title}>Barbershop Settings</Text>
          <Text style={styles.subtitle}>Setup based on your barbershop needs</Text>

          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Information</Text>
          <View style={styles.card}>
            <InfoRow
              label="Name"
              value="Barbershop Name"
              showChevron
              onPress={() => router.push('/edit-barbershop-info')}
            />
            <InfoRow
              label="Description"
              value="Barbershop Description"
              showChevron
              onPress={() => router.push('/edit-barbershop-info')}
            />
            <InfoRow
              label="Address"
              value="Address"
              showChevron
              isLast
              onPress={() => router.push('/edit-barbershop-info')}
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Booking Web</Text>
          <View style={styles.card}>
            <InfoRow
              label="Book Url"
              value="https://cukkr.com/hendra-..."
              showChevron
              isLast
              onPress={() => router.push('/edit-booking-url')}
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Operations</Text>
          <View style={styles.card}>
            <OperationRow label="Barbers" onPress={() => {}} />
            <OperationRow label="Customers" onPress={() => {}} />
            <OperationRow label="Open Hours" isLast onPress={() => {}} />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Delete Barber</Text>
          <DangerButton
            label="Delete This Barbershop"
            onPress={() => {}}
            style={styles.dangerBtn}
          />
        </ScrollView>

        <View style={styles.tabBarWrapper}>
          <BottomTabBar activeTab="profile" onTabPress={() => {}} />
        </View>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  sectionLabelTop: {
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  dangerBtn: {
    marginTop: 8,
  },
  tabBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#EEEEE0',
  },
});
