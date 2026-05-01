import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WizardProgress } from '@/src/components/WizardProgress';
import { TextInputField } from '@/src/components/TextInputField';
import { MultilineInputField } from '@/src/components/MultilineInputField';
import { PrefixedInputField } from '@/src/components/PrefixedInputField';

export function CreateBarbershopFirstServiceScreen() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('40000');
  const [duration, setDuration] = useState('30');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <WizardProgress totalSteps={3} currentStep={2} style={styles.wizard} />
        <Text style={styles.title}>Create Your First Service</Text>
        <Text style={styles.subtitle}>
          This will be the default service for your barbershop. You can change it anytime.
        </Text>
        <TextInputField
          label="Name"
          placeholder="Service Name"
          value={serviceName}
          onChangeText={setServiceName}
        />
        <MultilineInputField
          label="Description (Optional)"
          placeholder="Service Description"
          value={description}
          onChangeText={setDescription}
          style={styles.descInput}
        />
        <Text style={styles.fieldLabel}>Price</Text>
        <PrefixedInputField
          prefix="Rp"
          value={price}
          onChangeText={setPrice}
        />
        <Text style={[styles.fieldLabel, styles.fieldLabelTop]}>Duration</Text>
        <PrefixedInputField
          prefix="In Minutes"
          value={duration}
          onChangeText={setDuration}
        />
        <View style={styles.flex} />
        <TouchableOpacity
          style={styles.finishBtn}
          activeOpacity={0.8}
          onPress={() => router.push('/create-barbershop-success')}
        >
          <Text style={styles.finishLabel}>Finish</Text>
        </TouchableOpacity>
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
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  descInput: {
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
    marginTop: 16,
  },
  fieldLabelTop: {
    marginTop: 16,
  },
  flex: {
    flex: 1,
    minHeight: 32,
  },
  finishBtn: {
    backgroundColor: '#C6FF4D',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  finishLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
