import React from 'react';
import { View, Text, ScrollView, ViewStyle } from 'react-native';

export interface MessageItem {
  id: string;
  text: string;
  timestamp: string;
}

interface Props {
  messages: MessageItem[];
  style?: ViewStyle;
}

export function MessageThread({ messages, style }: Props) {
  return (
    <View className="bg-card rounded-xl p-lg min-h-[160px]" style={style}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
        {messages.map((msg) => (
          <View key={msg.id} className="gap-[4px]">
            <View className="self-start bg-[#C6ED3C] rounded-xl rounded-bl-[4px] px-[14px] py-[10px] max-w-[85%]">
              <Text className="text-[13px] text-dark leading-[18px]">{msg.text}</Text>
            </View>
            <Text className="text-[11px] text-[#8E8E97] self-end">{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


