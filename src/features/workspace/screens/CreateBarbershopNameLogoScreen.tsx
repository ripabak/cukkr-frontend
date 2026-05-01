import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WizardProgress } from '@/src/components/WizardProgress';
import { TextInputField } from '@/src/components/TextInputField';
import { ImageUploadBox } from '@/src/components/ImageUploadBox';
import { PrimaryButton } from '@/src/components/PrimaryButton';

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WizardProgress totalSteps={3} currentStep={0} style={styles.wizard} />
        <Text style={styles.title}>Create Barbershop</Text>
        <Text style={styles.subtitle}>Set up your own barbershop</Text>
        <TextInputField
          label="Barbershop Name"
          placeholder="Barbershop name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.logoLabel}>Logo</Text>
        <ImageUploadBox label="Choose Image" style={styles.imageUpload} />
        <View style={styles.flex} />
        <PrimaryButton
          label="Create"
          style={styles.button}
          onPress={() => router.push('/create-barbershop-invite-barber-empty')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEE0',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  wizard: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
  },
  logoLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
    marginTop: 16,
  },
  imageUpload: {
    marginTop: 0,
  },
  flex: {
    flex: 1,
    minHeight: 32,
  },
  button: {
    marginBottom: 16,
  },
});
