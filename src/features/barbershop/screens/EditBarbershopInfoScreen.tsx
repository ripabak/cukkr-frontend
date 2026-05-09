import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EditFieldHeader } from '@/src/components/EditFieldHeader';
import { TextInputField } from '@/src/components/TextInputField';
import { HelperCopy } from '@/src/components/HelperCopy';

export function EditBarbershopInfoScreen() {
  const router = useRouter();
  const [value, setValue] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>
      <View className="flex-1">
        <EditFieldHeader
          title="Name"
          onBack={() => router.back()}
          onSave={() => router.back()}
        />
        <View className="flex-1 px-[20px] pt-lg">
          <TextInputField
            placeholder="Barbershop Name"
            value={value}
            onChangeText={setValue}
          />
          <HelperCopy
            lines={[
              'Enter your barbershop name as you want it to appear to customers.',
              'This name will be shown on the booking page, notifications, and reports.',
            ]}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
