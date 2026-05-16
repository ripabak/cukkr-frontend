import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export function PublicPageContainer({ children }: Props) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFixed}>
        <View style={styles.webInner}>{children}</View>
      </View>
    );
  }
  return <View style={styles.native}>{children}</View>;
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webFixed: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  webInner: {
    width: '100%' as any,
    maxWidth: 480,
    height: '100%' as any,
    overflow: 'hidden' as any,
  },
});
