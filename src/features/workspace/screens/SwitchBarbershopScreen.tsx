import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { SelectionRow } from '@/src/components/SelectionRow';
import { PrimaryButton } from '@/src/components/PrimaryButton';

export function SwitchBarbershopScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader onBack={() => router.back()} />
        <Text style={styles.title}>Switch Barbershop</Text>
        <Text style={styles.subtitle}>{"Choose barbershop u're working on"}</Text>
        <View style={styles.spacer} />
        <SelectionRow label="Hendra Barbershop" onPress={() => router.back()} />
        <SelectionRow label="Matraman Barber" onPress={() => router.back()} isLast />
        <View style={styles.flex} />
        <PrimaryButton
          label="Create New Barbershop"
          onPress={() => router.push('/create-barbershop-name-logo')}
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    marginTop: 8,
  },
  spacer: {
    marginTop: 32,
  },
  flex: {
    flex: 1,
  },
});
