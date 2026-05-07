import { HelperCopy } from "@/src/components/HelperCopy";
import { MessageComposer } from "@/src/features/barbershop/components/MessageComposer";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SendMessagesToCustomersScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ count?: string; recipientName?: string }>();
  const recipientName = params.recipientName;
  const count = parseInt(params.count ?? "1", 10);

  const [message, setMessage] = useState("");

  const title = recipientName
    ? `Send Message to ${recipientName}`
    : `Send Messages (${count})`;

  const selectionMode = !recipientName;
  const bgColor = selectionMode ? "#C6ED3C" : "#F5F4E8";

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please write a message first");
      return;
    }
    toast.info("Messaging feature coming soon");
  };

  const canSend = message.trim().length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: canSend ? "#1A1A1A" : "#888888" }]}
            onPress={handleSend}
            activeOpacity={0.7}
          >
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
              "Send messages or announcements to your customers.",
              "Keep them informed about promotions, new services, or important updates.",
              "",
              "It will send the message through registered email or mobile phone.",
            ]}
            style={styles.helper}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },
  helper: { marginTop: 4 },
});
