import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onSelect: (type: 'walk-in' | 'appointment') => void;
  onClose: () => void;
}

export function BookingTypeSheet({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />
          <Text style={styles.title}>How would you like to book?</Text>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.75}
              onPress={() => onSelect('walk-in')}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.brand.primarySurface }]}>
                <Ionicons name="walk" size={28} color={Colors.brand.primaryDark} />
              </View>
              <Text style={styles.optionTitle}>Walk-In</Text>
              <Text style={styles.optionDesc}>Come now with a barber PIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.75}
              onPress={() => onSelect('appointment')}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#e8f4fd' }]}>
                <Ionicons name="calendar" size={28} color="#2196f3" />
              </View>
              <Text style={styles.optionTitle}>Appointment</Text>
              <Text style={styles.optionDesc}>Schedule a date &amp; time</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border.default,
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  option: {
    flex: 1,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 15,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
