import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { MetricCard } from "@/src/components/MetricCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import { ShortcutTile } from "@/src/components/ShortcutTile";
import { WorkspacePill } from "@/src/components/WorkspacePill";
import {
  ActivityCard,
  RecentActivity,
} from "@/src/features/home/components/ActivityCard";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// --- MOCK DATA ---
const MOCK_WORKSPACE_NAME = "Hendra Barbershop";
const MOCK_USER_NAME = "James Comberan";
const MOCK_PIN = "345678";
const MOCK_BOOKING_URL = "cukrr.com/hendra-barbershop";
const MOCK_METRICS = {
  todaySchedule: "5",
  walkIn: "2",
  appointment: "2",
  inProgress: "2",
  waiting: "3",
};

const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "1",
    time: "12m ago",
    duration: "30 mins",
    type: "in-progress",
    name: "Ethan James",
  },
  {
    id: "2",
    time: "12m ago",
    duration: "30 mins",
    name: "Ethan James",
    type: "waiting",
  },
  {
    id: "3",
    time: "12m ago",
    duration: "30 mins",
    name: "Ethan James",
    type: "waiting",
  },
  {
    id: "4",
    time: "12m ago",
    duration: "30 mins",
    name: "Ethan James",
    type: "in-progress",
  },
];

export function HomeDashboardScreen() {
  const [showPinModal, setShowPinModal] = useState(false);

  return (
    <ScreenShell contentStyle={{ paddingBottom: 100 }}>
      <View className="flex-row items-center justify-between mt-sm">
        <WorkspacePill name={MOCK_WORKSPACE_NAME} />
        <View className="w-10 h-10 rounded-full border border-border items-center justify-center bg-card">
          <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
        </View>
      </View>

      <View className="flex-row items-center mt-lg">
        <View className="w-12 h-12 rounded-full bg-[#D9D9D9] mr-md" />
        <View>
          <Text className="text-[13px] text-gray">Good Morning,</Text>
          <Text className="text-[18px] font-bold text-dark">{MOCK_USER_NAME}</Text>
        </View>
      </View>

      <View className="mt-xl bg-card rounded-lg p-lg">
        <View className="flex-row items-center">
          <Text className="text-caption text-gray flex-1">Walk-In PIN</Text>
          <Ionicons name="server-outline" size={16} color="#666666" />
        </View>
        <View className="flex-row items-center mt-[4px]">
          <Text className="text-[32px] font-bold text-dark flex-1">{MOCK_PIN}</Text>
          <TouchableOpacity
            onPress={() => setShowPinModal(true)}
            className="ml-sm"
          >
            <Ionicons name="refresh-outline" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-[10px] bg-accent rounded-full px-md py-[6px] self-start">
          <Text className="text-[13px] text-dark">{MOCK_BOOKING_URL}</Text>
          <Ionicons
            name="copy-outline"
            size={14}
            color="#1A1A1A"
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>

      <View className="mt-lg">
        <View className="flex-row gap-sm">
          <MetricCard
            label="Today's Schedule"
            value={MOCK_METRICS.todaySchedule}
            style={{ flex: 1 }}
          />
          <MetricCard
            label="Walk-In"
            value={MOCK_METRICS.walkIn}
            icon={<Ionicons name="people" size={18} color="#1A1A1A" />}
            style={{ flex: 1 }}
          />
          <MetricCard
            label="Appoint."
            value={MOCK_METRICS.appointment}
            icon={<Ionicons name="calendar" size={18} color="#1A1A1A" />}
            style={{ flex: 1 }}
          />
        </View>
        <View className="flex-row gap-sm mt-sm">
          <MetricCard
            label="In Progress"
            value={MOCK_METRICS.inProgress}
            accentColor="#2196F3"
            style={{ flex: 1 }}
          />
          <MetricCard
            label="Waiting"
            value={MOCK_METRICS.waiting}
            accentColor="#FF9800"
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <View className="mt-lg bg-card rounded-lg flex-row">
        <ShortcutTile
          label="Barbers"
          icon={<Ionicons name="people" size={24} color="#1A1A1A" />}
        />
        <ShortcutTile
          label="Customers"
          icon={<Ionicons name="person" size={24} color="#1A1A1A" />}
        />
        <ShortcutTile
          label="Services"
          icon={<Ionicons name="cut" size={24} color="#1A1A1A" />}
        />
      </View>

      <View className="flex-1 flex-row justify-between items-center mt-xl px-[4px]">
        <Text className="text-[14px] font-semibold text-[#7D7D7D]">Upcoming</Text>
        {/* buat jadi button */}
        <Text className="text-[13px] text-dark">See more</Text>
      </View>
      {MOCK_RECENT_ACTIVITIES.map((item) => (
        <ActivityCard key={item.id} item={item} />
      ))}
      <ConfirmationModal
        visible={showPinModal}
        title="Reset Walk-In PIN?"
        description="Reset your walk-in PIN to continue creating walk-in bookings securely."
        icon="refresh-outline"
        cancelLabel="No, Not Yet"
        confirmLabel="Yes"
        onCancel={() => setShowPinModal(false)}
        onConfirm={() => setShowPinModal(false)}
      />
    </ScreenShell>
  );
}
