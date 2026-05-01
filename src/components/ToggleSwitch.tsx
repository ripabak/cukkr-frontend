import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  style?: ViewStyle;
}

export function ToggleSwitch({ value, onValueChange, style }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      style={[styles.track, value ? styles.trackOn : styles.trackOff, style]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  trackOn: {
    backgroundColor: '#C6FF4D',
  },
  trackOff: {
    backgroundColor: '#D0CEC0',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});
