import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { InfoRow } from '@/src/components/InfoRow';
import { ToggleRow } from '@/src/components/ToggleRow';
import { OverflowMenu } from '@/src/components/OverflowMenu';
import { StatusBadge } from '@/src/components/StatusBadge';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { OperationRow } from '@/src/components/OperationRow';

const MOCK_SERVICE = {
  name: 'Classic Haircut',
  description: 'A timeless haircut that suits every style and occasion.',
  duration: '30 minutes',
  price: 'Rp 50.000',
  discount: '0%',
  isActive: true,
  isDefault: false,
};

export function ServiceDetailScreen() {
  const router = useRouter();
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [isActive, setIsActive] = useState(MOCK_SERVICE.isActive);
  const [isDefault, setIsDefault] = useState(MOCK_SERVICE.isDefault);
  const [showSetDefaultModal, setShowSetDefaultModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              onPress={() => setOverflowVisible(true)}
              activeOpacity={0.7}
              style={styles.overflowBtn}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageWrapper}>
            <View style={styles.serviceImage}>
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>General Information</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={MOCK_SERVICE.name} />
            <InfoRow label="Description" value={MOCK_SERVICE.description} isLast />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Pricing & Duration</Text>
          <View style={styles.card}>
            <InfoRow label="Duration" value={MOCK_SERVICE.duration} />
            <InfoRow label="Price" value={MOCK_SERVICE.price} />
            <InfoRow label="Discount" value={MOCK_SERVICE.discount} isLast />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Operational Details</Text>
          <Text style={styles.operationalSubtitle}>
            Toggle activation and configure default service settings.
          </Text>
          <View style={styles.card}>
            <ToggleRow
              label="Active"
              value={isActive}
              onValueChange={setIsActive}
            />
            {isDefault ? (
              <View style={styles.defaultRow}>
                <Text style={styles.defaultLabel}>Set As Default</Text>
                <StatusBadge label="Default" variant="default" />
              </View>
            ) : (
              <OperationRow
                label="Set As Default"
                onPress={() => setShowSetDefaultModal(true)}
                isLast
              />
            )}
          </View>
        </ScrollView>

        {overflowVisible ? (
          <View style={styles.overflowOverlay}>
            <OverflowMenu
              visible
              items={[
                {
                  label: 'Edit Service',
                  onPress: () => router.push('/add-or-edit-service'),
                },
                {
                  label: 'Delete this Service',
                  danger: true,
                  onPress: () => {},
                },
              ]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        <ConfirmationModal
          visible={showSetDefaultModal}
          icon="checkmark-circle-outline"
          title="Set as Default Service"
          description="This service will become the default service for your barbershop."
          confirmLabel="Set Default"
          cancelLabel="Cancel"
          onConfirm={() => {
            setIsDefault(true);
            setShowSetDefaultModal(false);
          }}
          onCancel={() => setShowSetDefaultModal(false)}
        />
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
    paddingBottom: 40,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    position: 'relative',
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
  operationalSubtitle: {
    fontSize: 12,
    color: '#B0ADA0',
    marginBottom: 8,
  },
  overflowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  defaultLabel: {
    flex: 1,
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1A1A',
  },
});
