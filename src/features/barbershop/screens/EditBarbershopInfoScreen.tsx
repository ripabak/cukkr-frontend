import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EditFieldHeader } from '@/src/components/EditFieldHeader';
import { TextInputField } from '@/src/components/TextInputField';
import { HelperCopy } from '@/src/components/HelperCopy';

export function EditBarbershopInfoScreen() {
  const router = useRouter();
  const [value, setValue] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <EditFieldHeader
          title="Name"
          onBack={() => router.back()}
          onSave={() => router.back()}
        />
        <View style={styles.content}>
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
            style={styles.helper}
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
  outer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  helper: {
    marginTop: 16,
  },
});
