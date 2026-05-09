import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <View className="flex-row items-center px-[20px] py-md gap-md">
          <TouchableOpacity className="w-9 h-9 rounded-full bg-card items-center justify-center" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text className="flex-1 text-[16px] font-bold text-dark text-center">{title}</Text>
          <TouchableOpacity className="w-9 h-9 rounded-full bg-[#888888] items-center justify-center" onPress={() => {}}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View className="px-[20px] pt-sm gap-lg">
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
            style={{ marginTop: 4 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

