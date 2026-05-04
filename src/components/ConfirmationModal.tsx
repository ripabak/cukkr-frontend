import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  icon?: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmationModal({
  visible,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const hasBoth = !!confirmLabel && !!cancelLabel;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {icon ? (
            <View style={styles.iconWrapper}>
              <Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={32} color="#1A1A1A" />
            </View>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={[styles.buttons, hasBoth && styles.buttonsRow]}>
            {cancelLabel ? (
              <TouchableOpacity
                onPress={onCancel}
                activeOpacity={0.8}
                style={[styles.btn, styles.btnDark, hasBoth && styles.btnFlex]}
              >
                <Text style={styles.btnDarkLabel}>{cancelLabel}</Text>
              </TouchableOpacity>
            ) : null}
            {confirmLabel ? (
              <TouchableOpacity
                onPress={onConfirm}
                activeOpacity={0.8}
                style={[styles.btn, styles.btnOutline, hasBoth && styles.btnFlex]}
              >
                <Text style={styles.btnOutlineLabel}>{confirmLabel}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '85%',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  btn: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFlex: {
    flex: 1,
  },
  btnDark: {
    backgroundColor: '#1A1A1A',
  },
  btnDarkLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
  },
  btnOutlineLabel: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
});
