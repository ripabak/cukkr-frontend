import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFrame } from '@/src/components/FrameContext';

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlertModal({ visible, title, description, actionLabel, onAction }: Props) {
  const { frameWidth } = useFrame();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { width: frameWidth * 0.85 }]}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          {actionLabel ? (
            <TouchableOpacity onPress={onAction} activeOpacity={0.8} style={styles.btn}>
              <Text style={styles.btnLabel}>{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}
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
  btn: {
    marginTop: 24,
    height: 52,
    borderRadius: 999,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
