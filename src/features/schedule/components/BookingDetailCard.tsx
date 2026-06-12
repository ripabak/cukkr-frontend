import { Colors } from "@/src/theme/colors";
import { BookingType } from "@/src/components/BookingCard";
import { InfoRow } from "@/src/components/InfoRow";
import { StatusBadge } from "@/src/components/StatusBadge";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export type BookingDetailStatus =
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "requested"
  | "declined";

interface ServiceLine {
  name: string;
  price: string;
}

interface InfoLine {
  label: string;
  value: string;
  valueIconName?: string;
}

interface Props {
  customerName: string;
  dateLabel: string;
  metaIcon?: "people" | "calendar";
  bookingType?: BookingType;
  metaLine1: string;
  metaLine2?: string;
  status: BookingDetailStatus;
  infoRows?: InfoLine[];
  services?: ServiceLine[];
  notes?: string;
  paymentSummary?: { label: string; value: string }[];
  style?: ViewStyle;
  children?: React.ReactNode;
}

const STATUS_TO_BADGE: Record<BookingDetailStatus, string> = {
  waiting: "waiting",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
  requested: "requested",
  declined: "declined",
};

const STATUS_LABEL: Record<BookingDetailStatus, string> = {
  waiting: "Waiting",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  requested: "Requested",
  declined: "Declined",
};

export function BookingDetailCard({
  customerName,
  dateLabel,
  metaIcon = "calendar",
  bookingType,
  metaLine1,
  metaLine2,
  status,
  infoRows = [],
  services = [],
  notes,
  paymentSummary = [],
  style,
  children,
}: Props) {
  const resolvedMetaIcon = bookingType
    ? bookingType === "walk_in"
      ? "walk"
      : "calendar"
    : metaIcon === "people"
      ? "people"
      : "calendar";
  return (
    <ScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <View style={styles.metaRow}>
            <Ionicons
              name={resolvedMetaIcon as any}
              size={14}
              color={Colors.text.secondary}
            />
            <View style={styles.metaText}>
              <Text style={styles.metaLine}>{metaLine1}</Text>
              {metaLine2 ? (
                <Text style={styles.metaLine}>{metaLine2}</Text>
              ) : null}
            </View>
          </View>
          <StatusBadge
            label={STATUS_LABEL[status]}
            variant={STATUS_TO_BADGE[status] as any}
            style={styles.badge}
          />
        </View>
      </View>

      {/* Info rows */}
      {infoRows.length > 0 ? (
        <View style={styles.section}>
          {infoRows.map((row, i) => (
            <InfoRow
              key={i}
              label={row.label}
              value={row.value}
              valueIconName={row.valueIconName}
              isLast={i === infoRows.length - 1}
            />
          ))}
        </View>
      ) : null}

      {/* Services */}
      {services.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {services.map((s, i) => (
            <View key={i} style={styles.serviceLine}>
              <Text style={styles.serviceLabel}>{s.name}</Text>
              <Text style={styles.servicePrice}>{s.price}</Text>
            </View>
          ))}
          {notes ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notes}>{notes}</Text>
            </>
          ) : null}
        </View>
      ) : null}

      {/* Payment Summary */}
      {paymentSummary.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          {paymentSummary.map((line, i) => (
            <View key={i} style={styles.paymentLine}>
              <Text style={styles.paymentLabel}>{line.label}</Text>
              <Text style={styles.paymentValue}>{line.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    flex: 1,
  },
  metaLine: {
    fontSize: 13,
    color: "#444444",
    lineHeight: 18,
  },
  badge: {
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  serviceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: 14,
    color: "#444444",
    flex: 1,
    flexShrink: 1,
  },
  servicePrice: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
    marginLeft: 12,
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E5D8",
    marginVertical: 12,
  },
  notes: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },
  paymentLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
    flexShrink: 1,
  },
  paymentValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
    marginLeft: 12,
  },
});
