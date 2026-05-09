import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>
      <View className="flex-1">
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              onPress={() => setOverflowVisible(true)}
              activeOpacity={0.7}
              className="w-9 h-9 rounded-full bg-dark items-center justify-center"
            >
              <Ionicons name="ellipsis-horizontal" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-[20px]">
            <View className="w-20 h-20 rounded-md bg-[#D9D9D9] relative">
              <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-dark items-center justify-center">
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <Text className="text-[13px] text-gray mb-sm">General Information</Text>
          <View className="bg-card rounded-lg">
            <InfoRow label="Name" value={MOCK_SERVICE.name} />
            <InfoRow label="Description" value={MOCK_SERVICE.description} isLast />
          </View>

          <Text className="text-[13px] text-gray mb-sm mt-lg">Pricing & Duration</Text>
          <View className="bg-card rounded-lg">
            <InfoRow label="Duration" value={MOCK_SERVICE.duration} />
            <InfoRow label="Price" value={MOCK_SERVICE.price} />
            <InfoRow label="Discount" value={MOCK_SERVICE.discount} isLast />
          </View>

          <Text className="text-[13px] text-gray mb-sm mt-lg">Operational Details</Text>
          <Text className="text-caption text-light-gray mb-sm">
            Toggle activation and configure default service settings.
          </Text>
          <View className="bg-card rounded-lg">
            <ToggleRow
              label="Active"
              value={isActive}
              onValueChange={setIsActive}
            />
            {isDefault ? (
              <View className="flex-row items-center px-lg py-[14px]">
                <Text className="flex-1 font-bold text-[14px] text-dark">Set As Default</Text>
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
          <View className="absolute inset-0 z-50">
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

