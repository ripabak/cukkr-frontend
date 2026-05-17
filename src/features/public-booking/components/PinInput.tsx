import { Colors } from '@/src/theme/colors';
import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function PinInput({ value, onChange }: Props) {
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const chars = (value + '    ').slice(0, 4).split('');
    chars[index] = digit;
    const newVal = chars.join('').trimEnd();
    onChange(newVal.slice(0, 4));
    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      const chars = (value + '    ').slice(0, 4).split('');
      chars[index - 1] = '';
      onChange(chars.join('').trimEnd());
      refs[index - 1].current?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {[0, 1, 2, 3].map(i => (
        <TextInput
          key={i}
          ref={refs[i]}
          style={[styles.cell, !!value[i] && styles.cellFilled]}
          value={value[i] ?? ''}
          onChangeText={v => handleChange(i, v)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          secureTextEntry
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  cell: {
    width: 60,
    height: 64,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.text.primary,
    backgroundColor: Colors.bg.surface,
  },
  cellFilled: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primarySurface,
  },
});
