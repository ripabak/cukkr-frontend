import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { TextInputField } from '@/src/components/TextInputField';
import { HelperCopy } from '@/src/components/HelperCopy';
import { IconActionButton } from '@/src/components/IconActionButton';

export function InviteBarberScreen() {
  const router = useRouter();
  const [contact, setContact] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>
      <View className="flex-1">
        <ScreenHeader
          title="Invite Barber"
          onBack={() => router.back()}
          rightAction={
            <IconActionButton
              iconName="paper-plane-outline"
              onPress={() => {}}
              size={36}
            />
          }
        />

        <View className="px-[20px] pt-sm">
          <TextInputField
            label="Email or Phone"
            placeholder="Enter email or phone number"
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
          />
          <HelperCopy
            lines={[
              'Enter the email address or phone number of the barber you want to invite.',
              'They will receive an invitation to join your barbershop.',
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

