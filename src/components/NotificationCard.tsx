import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from './StatusBadge';
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
  className?: string;
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
  className,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      className={`bg-card rounded-xl p-lg ${className ?? ''}`}
      style={style}
    >
      <View className="flex-row justify-between items-center mb-sm">
        <Text className="text-[12px] text-[#888888] font-medium">{title}</Text>
        <Text className="text-[12px] text-[#AAAAAA]">{timestamp}</Text>
      </View>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-start gap-sm">
          {status === 'pending' ? (
            <View className="w-[8px] h-[8px] rounded-full bg-blue mt-[6px]" />
          ) : null}
          <View className="flex-1">
            <Text className="text-[16px] font-semibold text-dark mb-[4px]">{name}</Text>
            {detail ? <Text className="text-[13px] text-gray leading-[18px]">{detail}</Text> : null}
            {status === 'declined' ? (
              <StatusBadge label="Declined" variant="declined" style={{ marginTop: 8 }} />
            ) : null}
            {showActions && status === 'pending' ? (
              <InlineDecisionButtons onDecline={onDecline} onAccept={onAccept} />
            ) : null}
          </View>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center ml-md">
          <Ionicons name={TYPE_ICON[type]} size={20} color="#CCCCCC" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

