import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WizardProgress } from '@/src/components/WizardProgress';
import { InviteRow } from '@/src/components/InviteRow';
import { TextInputField } from '@/src/components/TextInputField';
import { SecondaryButton } from '@/src/components/SecondaryButton';
import { PrimaryButton } from '@/src/components/PrimaryButton';

export function CreateBarbershopInviteBarberFilledScreen() {
  const router = useRouter();
  const [barber, setBarber] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <WizardProgress totalSteps={3} currentStep={1} style={styles.wizard} />
        <Text style={styles.title}>Invite Barber</Text>
        <Text style={styles.subtitle}>Inviting barber to your barbershop</Text>
        <Text style={styles.barbersLabel}>{"Barbershop's barbers"}</Text>
        <InviteRow email="rifa@gmail.com" onRemove={() => {}} />
        <InviteRow email="rifafaruqi@gmail.com" onRemove={() => {}} style={styles.inviteRowTop} />
        <TextInputField
          label="Add Barber"
          placeholder="email / phone number *"
          value={barber}
          onChangeText={setBarber}
          style={styles.inputTop}
        />
        <SecondaryButton
          label="Invite"
          style={styles.inviteBtn}
        />
        <View style={styles.flex} />
        <PrimaryButton
          label="Next"
          onPress={() => router.push('/create-barbershop-first-service')}
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
  container: {
    flex: 1,
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
  barbersLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inviteRowTop: {
    marginTop: 8,
  },
  inputTop: {
    marginTop: 16,
  },
  inviteBtn: {
    marginTop: 12,
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: 32,
  },
  flex: {
    flex: 1,
  },
});
