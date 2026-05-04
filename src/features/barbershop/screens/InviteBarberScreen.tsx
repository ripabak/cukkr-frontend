import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        <View style={styles.content}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEE0',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
