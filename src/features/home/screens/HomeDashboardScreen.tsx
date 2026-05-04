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
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <ScreenShell contentStyle={styles.scrollContentPadding}>
      <View style={styles.topRow}>
        <WorkspacePill name={MOCK_WORKSPACE_NAME} />
        <View style={styles.notifCircle}>
          <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
        </View>
      </View>

      <View style={styles.greetingRow}>
        <View style={styles.avatar} />
        <View style={styles.greetingText}>
          <Text style={styles.greetingSmall}>Good Morning,</Text>
          <Text style={styles.greetingName}>{MOCK_USER_NAME}</Text>
        </View>
      </View>

      <View style={styles.pinCard}>
        <View style={styles.pinTopRow}>
          <Text style={styles.pinLabel}>Walk-In PIN</Text>
          <Ionicons name="server-outline" size={16} color="#666666" />
        </View>
        <View style={styles.pinValueRow}>
          <Text style={styles.pinValue}>{MOCK_PIN}</Text>
          <TouchableOpacity
            onPress={() => setShowPinModal(true)}
            style={styles.refreshBtn}
          >
            <Ionicons name="refresh-outline" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        <View style={styles.linkPill}>
          <Text style={styles.linkText}>{MOCK_BOOKING_URL}</Text>
          <Ionicons
            name="copy-outline"
            size={14}
            color="#1A1A1A"
            style={styles.copyIcon}
          />
        </View>
      </View>

      <View style={styles.metricsSection}>
        <View style={styles.metricsRow}>
          <MetricCard
            label="Today's Schedule"
            value={MOCK_METRICS.todaySchedule}
            style={styles.metricFlex}
          />
          <MetricCard
            label="Walk-In"
            value={MOCK_METRICS.walkIn}
            icon={<Ionicons name="people" size={18} color="#1A1A1A" />}
            style={styles.metricFlex}
          />
          <MetricCard
            label="Appoint."
            value={MOCK_METRICS.appointment}
            icon={<Ionicons name="calendar" size={18} color="#1A1A1A" />}
            style={styles.metricFlex}
          />
        </View>
        <View style={[styles.metricsRow, styles.metricsRowTop]}>
          <MetricCard
            label="In Progress"
            value={MOCK_METRICS.inProgress}
            accentColor="#2196F3"
            style={styles.metricFlex}
          />
          <MetricCard
            label="Waiting"
            value={MOCK_METRICS.waiting}
            accentColor="#FF9800"
            style={styles.metricFlex}
          />
        </View>
      </View>

      <View style={styles.shortcutsCard}>
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

      <View style={styles.upcomingRow}>
        <Text style={styles.recentLabel}>Upcoming</Text>
        {/* buat jadi button */}
        <Text style={styles.seeMore}>See more</Text>
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

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  notifCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0DDD0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },
  greetingText: {
    flexDirection: "column",
  },
  greetingSmall: {
    fontSize: 13,
    color: "#666666",
  },
  greetingName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  pinCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  pinTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinLabel: {
    fontSize: 12,
    color: "#666666",
    flex: 1,
  },
  pinValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  pinValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  refreshBtn: {
    marginLeft: 8,
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#C6FF4D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  linkText: {
    fontSize: 13,
    color: "#1A1A1A",
  },
  copyIcon: {
    marginLeft: 8,
  },
  metricsSection: {
    marginTop: 16,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricsRowTop: {
    marginTop: 8,
  },
  metricFlex: {
    flex: 1,
  },
  shortcutsCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7D7D7D",
  },
  upcomingRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 4,
  },
  scrollContentPadding: {
    paddingBottom: 100,
  },
  seeMore: {
    fontSize: 13,
    color: "#1A1A1A",
  },
});
