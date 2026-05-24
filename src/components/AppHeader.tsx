import { Colors } from '@/src/theme/colors';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export function AppHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/public/cukkr-logo-trans.png')}
        style={styles.logo}
        resizeMode="contain"
        tintColor={Colors.brand.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.default,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 36,
    height: 36,
  },
});
