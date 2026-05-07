import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  declineLabel?: string;
  acceptLabel?: string;
  onDecline?: () => void;
  onAccept?: () => void;
  style?: ViewStyle;
}

export function DualActionFooter({
  declineLabel = 'Decline',
  acceptLabel = 'Accept',
  onDecline,
  onAccept,
  style,
}: Props) {
  return (
    <View style={[styles.footer, style]}>
      <TouchableOpacity
        onPress={onDecline}
        activeOpacity={0.8}
        style={[styles.btn, styles.declineBtn]}
      >
        <Text style={styles.declineLabel}>{declineLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAccept}
        activeOpacity={0.8}
        style={[styles.btn, styles.acceptBtn]}
      >
        <Text style={styles.acceptLabel}>{acceptLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: '#F5F4E8',
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtn: {
    borderWidth: 1.5,
    borderColor: '#FF4A4A',
  },
  acceptBtn: {
    borderWidth: 1.5,
    borderColor: '#55C46B',
  },
  declineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4A4A',
  },
  acceptLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#55C46B',
  },
});
