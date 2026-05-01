import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MessageComposer } from '@/src/components/MessageComposer';
import { HelperCopy } from '@/src/components/HelperCopy';

interface Props {
  recipientCount?: number;
  recipientName?: string;
  selectionMode?: boolean;
}

export function SendMessagesToCustomersScreen({
  recipientCount = 1,
  recipientName,
  selectionMode = true,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const title = recipientName
    ? `Send Messages To ${recipientName}`
    : `Send Messages (${recipientCount})`;

  const bgColor = selectionMode ? '#C6ED3C' : '#F5F4E8';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity style={styles.sendBtn} onPress={() => {}}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <MessageComposer
            value={message}
            onChangeText={setMessage}
            placeholder="Messages to selected customers"
          />

          <HelperCopy
            lines={[
              'Send messages or announcements to your customers.',
              'Keep them informed about promotions, new services, or important updates from your barbershop.',
              '',
              'It will send the message through registered email or mobile phone',
            ]}
            style={styles.helper}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#888888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },
  helper: {
    marginTop: 4,
  },
});
