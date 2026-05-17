import { Colors } from '@/src/theme/colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '@/src/components/StatusBadge';
import { InlineDecisionButtons } from './InlineDecisionButtons';

export type NotificationType = 'appointment-request' | 'walk-in' | 'invitation' | 'general';

interface Props {
  type: NotificationType;
  title: string;
  name: string;
  detail?: string;
  timestamp: string;
  status?: 'pending' | 'declined' | 'accepted';
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
  style?: ViewStyle;
}

const TYPE_ICON: Record<NotificationType, React.ComponentProps<typeof Ionicons>['name']> = {
  'appointment-request': 'calendar',
  'walk-in': 'people',
  invitation: 'person-add',
  general: 'notifications',
};

export function NotificationCard({
  type,
  title,
  name,
  detail,
  timestamp,
  status,
  showActions,
  onAccept,
  onDecline,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <Text style={styles.typeLabel}>{title}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <View style={styles.bodyRow}>
        <View style={styles.bodyLeft}>
          {status === 'pending' ? (
            <View style={styles.dot} />
          ) : null}
          <View style={styles.bodyText}>
            <Text style={styles.name}>{name}</Text>
            {detail ? <Text style={styles.detail}>{detail}</Text> : null}
            {status === 'declined' ? (
              <StatusBadge label="Declined" variant="declined" style={styles.declinedBadge} />
            ) : null}
            {showActions && status === 'pending' ? (
              <InlineDecisionButtons onDecline={onDecline} onAccept={onAccept} />
            ) : null}
          </View>
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name={TYPE_ICON[type]} size={20} color={Colors.icon.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    color: Colors.icon.muted,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  bodyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.inProgress,
    marginTop: 6,
  },
  bodyText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  declinedBadge: {
    marginTop: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
