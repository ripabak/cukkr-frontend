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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  logo: {
    width: 36,
    height: 36,
  },
});
