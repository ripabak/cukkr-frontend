import { Colors } from "@/src/theme/colors";
import { BookingType } from "@/src/components/BookingCard";
import { InfoRow } from "@/src/components/InfoRow";
import { StatusBadge } from "@/src/components/StatusBadge";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
  onCustomerPress?: () => void;
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
  onCustomerPress,
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
          {onCustomerPress ? (
            <TouchableOpacity
              style={styles.customerNameRow}
              onPress={onCustomerPress}
              activeOpacity={0.6}
            >
              <AppText style={styles.customerNameLink}>{customerName}</AppText>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.brand.primary}
              />
            </TouchableOpacity>
          ) : (
            <AppText style={styles.customerName}>{customerName}</AppText>
          )}
          <AppText style={styles.dateLabel}>{dateLabel}</AppText>
          <View style={styles.metaRow}>
            <Ionicons
              name={resolvedMetaIcon as any}
              size={14}
              color={Colors.text.secondary}
            />
            <View style={styles.metaText}>
              <AppText style={styles.metaLine}>{metaLine1}</AppText>
              {metaLine2 ? (
                <AppText style={styles.metaLine}>{metaLine2}</AppText>
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
          <AppText style={styles.sectionTitle}>Services</AppText>
          {services.map((s, i) => (
            <View key={i} style={styles.serviceLine}>
              <AppText style={styles.serviceLabel}>{s.name}</AppText>
              <AppText style={styles.servicePrice}>{s.price}</AppText>
            </View>
          ))}
          {notes ? (
            <>
              <View style={styles.divider} />
              <AppText style={styles.sectionTitle}>Notes</AppText>
              <AppText style={styles.notes}>{notes}</AppText>
            </>
          ) : null}
        </View>
      ) : null}

      {/* Payment Summary */}
      {paymentSummary.length > 0 ? (
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Payment Summary</AppText>
          {paymentSummary.map((line, i) => (
            <View key={i} style={styles.paymentLine}>
              <AppText style={styles.paymentLabel}>{line.label}</AppText>
              <AppText style={styles.paymentValue}>{line.value}</AppText>
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
  customerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  customerNameLink: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.brand.primaryDark,
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
