import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientButton } from '@/src/components/GradientButton';

export function CreateBarbershopSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Congratulation 🎉</Text>
        <Text style={styles.subtitle}>
          {'Your barbershop, "Hendra Barbershop," has been created.'}
        </Text>
        <GradientButton
          label="Open My Barbershop"
          icon="login"
          style={styles.button}
          onPress={() => router.replace('/home-dashboard')}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
  },
  button: {
    marginTop: 48,
  },
});
