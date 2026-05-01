import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';

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
    <View style={[styles.container, style]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageGroup}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
  },
  list: {
    gap: 16,
  },
  messageGroup: {
    gap: 4,
  },
  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#C6ED3C',
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '85%',
  },
  bubbleText: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: '#8E8E97',
    alignSelf: 'flex-end',
  },
});
