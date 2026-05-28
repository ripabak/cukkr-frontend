import { MultilineInputField } from '@/src/components/MultilineInputField';
import { Colors } from '@/src/theme/colors';
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFrame } from '@/src/components/FrameContext';

interface Props {
    visible: boolean;
    onSend: (reason?: string) => void;
    onCancel: () => void;
    isSending: boolean;
}

export function DeclineReasonModal({ visible, onSend, onCancel, isSending }: Props) {
    const { frameWidth } = useFrame();
    const [reason, setReason] = useState('');

    const handleSend = () => {
        onSend(reason.trim() || undefined);
    };

    const handleCancel = () => {
        setReason('');
        onCancel();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
            <View style={styles.overlay}>
                <View style={[styles.card, { width: frameWidth * 0.85 }]}>
                    <Text style={styles.title}>Decline this booking?</Text>
                    <Text style={styles.subtitle}>You can add a reason for the customer (optional).</Text>
                    <MultilineInputField
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Add a reason..."
                        numberOfLines={4}
                        style={styles.input}
                    />
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={handleSend}
                            activeOpacity={0.8}
                            disabled={isSending}
                            style={[styles.btn, styles.btnPrimary, isSending && styles.btnDisabled]}
                        >
                            <Text style={styles.btnPrimaryLabel}>{isSending ? 'Sending...' : 'Send'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleCancel}
                            activeOpacity={0.8}
                            style={[styles.btn, styles.btnOutline]}
                        >
                            <Text style={styles.btnOutlineLabel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.bg.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: Colors.bg.default,
        borderRadius: 24,
        padding: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        marginBottom: 4,
    },
    buttons: {
        marginTop: 20,
        gap: 12,
    },
    btn: {
        height: 52,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimary: {
        backgroundColor: Colors.brand.primary,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnPrimaryLabel: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '700',
    },
    btnOutline: {
        borderWidth: 1.5,
        borderColor: Colors.border.default,
    },
    btnOutlineLabel: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});
