import { Colors } from "@/src/theme/colors";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useBookings } from "@/src/features/schedule/hooks";
import { formatDisplayDate, formatTime12h, toApiDate } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  scheduledAt: string;
  bookingId: string;
}

export function BookingTimelinePreview({ scheduledAt, bookingId }: Props) {
  const { t } = useI18nContext();
  const [expanded, setExpanded] = useState(false);
  const scheduleDate = new Date(scheduledAt as unknown as Date);
  const dateKey = toApiDate(scheduleDate);
  const dateLabel = formatDisplayDate(scheduleDate);

  const { data: dayBookings = [], isLoading } = useBookings(dateKey);

  const sortedBookings = useMemo(() => {
    const filtered = dayBookings.filter(
      (b) => b.status !== "cancelled" && b.status !== "completed",
    );
    return filtered
      .slice()
      .sort((a, b) => {
        const aTime =
          a.scheduledAt instanceof Date
            ? a.scheduledAt.getTime()
            : a.scheduledAt
              ? new Date(a.scheduledAt as Date).getTime()
              : new Date(a.createdAt as Date).getTime();
        const bTime =
          b.scheduledAt instanceof Date
            ? b.scheduledAt.getTime()
            : b.scheduledAt
              ? new Date(b.scheduledAt as Date).getTime()
              : new Date(b.createdAt as Date).getTime();
        if (aTime !== bTime) return aTime - bTime;
        return new Date(a.createdAt as Date).getTime() - new Date(b.createdAt as Date).getTime();
      });
  }, [dayBookings]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.text.secondary} />
      </View>
    );
  }

  if (sortedBookings.length === 0) {
    return null;
  }

  const thisIndex = sortedBookings.findIndex((b) => b.id === bookingId);

  const timelineItems = expanded
    ? sortedBookings
    : (() => {
        if (thisIndex === -1) return sortedBookings.slice(0, 3);
        const start = Math.max(0, thisIndex - 1);
        const end = Math.min(sortedBookings.length, thisIndex + 2);
        return sortedBookings.slice(start, end);
      })();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="time-outline" size={18} color={Colors.text.secondary} />
          <AppText style={styles.title}>{dateLabel}</AppText>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.text.muted}
        />
      </TouchableOpacity>

      <View style={styles.timeline}>
        {!expanded && thisIndex > 0 && (
          <AppText style={styles.truncatedHint}>
            ... {thisIndex} {t("bookings.before")}
          </AppText>
        )}

        {timelineItems.map((item, idx) => {
          const isCurrent = item.id === bookingId;
          const timeDate =
            item.type === "appointment" && item.scheduledAt
              ? new Date(item.scheduledAt as Date)
              : new Date(item.createdAt as Date);

          return (
            <View
              key={item.id}
              style={[
                styles.timelineRow,
                !isCurrent && styles.timelineRowDimmed,
                isCurrent && styles.timelineRowHighlight,
              ]}
            >
              <View style={styles.timelineLine}>
                <View
                  style={[
                    styles.dot,
                    isCurrent ? styles.dotHighlight : styles.dotDimmed,
                  ]}
                />
                {idx < timelineItems.length - 1 && (
                  <View style={styles.lineConnector} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTop}>
                  <AppText
                    style={[
                      styles.timeLabel,
                      isCurrent && styles.timeLabelHighlight,
                    ]}
                  >
                    {formatTime12h(timeDate)}
                  </AppText>
                  {isCurrent && (
                    <View style={styles.youBadge}>
                      <AppText style={styles.youBadgeText}>
                        {t("bookings.timelineYouAreHere")}
                      </AppText>
                    </View>
                  )}
                </View>
                <AppText
                  style={[
                    styles.customerName,
                    isCurrent && styles.customerNameHighlight,
                  ]}
                  numberOfLines={1}
                >
                  {item.customerName}
                </AppText>
                <View style={styles.serviceRow}>
                  {item.barber ? (
                    <>
                      <Ionicons
                        name="cut-outline"
                        size={10}
                        color={isCurrent ? Colors.brand.primaryDark : Colors.text.muted}
                      />
                      <AppText
                        style={[
                          styles.barberName,
                          isCurrent && styles.barberNameHighlight,
                        ]}
                        numberOfLines={1}
                      >
                        {" "}
                        {item.barber.name}
                      </AppText>
                    </>
                  ) : null}
                  {item.barber && item.serviceNames.length > 0 && (
                    <AppText style={styles.separator}> · </AppText>
                  )}
                  <AppText
                    style={[
                      styles.serviceNames,
                      isCurrent && styles.serviceNamesHighlight,
                    ]}
                    numberOfLines={1}
                  >
                    {item.serviceNames.join(", ")}
                  </AppText>
                </View>
              </View>
            </View>
          );
        })}

        {!expanded &&
          thisIndex >= 0 &&
          thisIndex < sortedBookings.length - 2 && (
            <AppText style={styles.truncatedHint}>
              ... {sortedBookings.length - thisIndex - 2} {t("bookings.after")}
            </AppText>
          )}
      </View>

      {!expanded && thisIndex === -1 && sortedBookings.length > 3 && (
        <AppText style={styles.truncatedHint}>
          ... +{sortedBookings.length - 3} {t("bookings.more")}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  timeline: {
    marginTop: 12,
  },
  truncatedHint: {
    fontSize: 11,
    color: Colors.text.muted,
    marginVertical: 4,
    paddingLeft: 14,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 2,
  },
  timelineRowHighlight: {
    backgroundColor: Colors.brand.primarySurface,
  },
  timelineRowDimmed: {
    opacity: 0.45,
  },
  timelineLine: {
    alignItems: "center",
    marginRight: 12,
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  dotHighlight: {
    backgroundColor: Colors.brand.primaryDark,
  },
  dotDimmed: {
    backgroundColor: Colors.border.default,
  },
  lineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 2,
    minHeight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  timeLabelHighlight: {
    color: Colors.brand.primaryDark,
  },
  youBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  customerNameHighlight: {
    fontWeight: "700",
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberName: {
    fontSize: 11,
    color: Colors.text.muted,
    flexShrink: 1,
  },
  barberNameHighlight: {
    color: Colors.text.secondary,
  },
  separator: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  serviceNames: {
    fontSize: 11,
    color: Colors.text.muted,
    flexShrink: 1,
  },
  serviceNamesHighlight: {
    color: Colors.text.secondary,
  },
});
