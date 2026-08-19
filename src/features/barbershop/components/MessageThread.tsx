import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { View, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageGroup}>
            <View style={styles.bubble}>
              <AppText style={styles.bubbleText}>{msg.text}</AppText>
            </View>
            <AppText style={styles.timestamp}>{msg.timestamp}</AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.bg.default,
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
      alignSelf: "flex-start",
      backgroundColor: c.brand.primary,
      borderRadius: 12,
      borderBottomLeftRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: "85%",
    },
    bubbleText: {
      fontSize: 13,
      color: c.text.primary,
      lineHeight: 18,
    },
    timestamp: {
      fontSize: 11,
      color: c.icon.muted,
      alignSelf: "flex-end",
    },
  });
