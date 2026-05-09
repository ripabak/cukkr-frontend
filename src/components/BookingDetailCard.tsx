import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { InfoRow } from './InfoRow';
import { StatusBadge } from './StatusBadge';

export type BookingDetailStatus = 'waiting' | 'in-progress' | 'completed' | 'canceled' | 'requested' | 'declined';

interface ServiceLine {
  name: string;
  price: string;
}

interface InfoLine {
  label: string;
  value: string;
}

interface Props {
  customerName: string;
  dateLabel: string;
  metaIcon?: 'people' | 'calendar';
  metaLine1: string;
  metaLine2?: string;
  status: BookingDetailStatus;
  infoRows?: InfoLine[];
  services?: ServiceLine[];
  notes?: string;
  paymentSummary?: { label: string; value: string }[];
  onWhatsApp?: () => void;
  style?: ViewStyle;
  className?: string;
  children?: React.ReactNode;
}

const STATUS_TO_BADGE: Record<BookingDetailStatus, string> = {
  waiting: 'waiting',
  'in-progress': 'in-progress',
  completed: 'completed',
  canceled: 'canceled',
  requested: 'requested',
  declined: 'declined',
};

const STATUS_LABEL: Record<BookingDetailStatus, string> = {
  waiting: 'Waiting',
  'in-progress': 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
  requested: 'Requested',
  declined: 'Declined',
};

export function BookingDetailCard({
  customerName,
  dateLabel,
  metaIcon = 'calendar',
  metaLine1,
  metaLine2,
  status,
  infoRows = [],
  services = [],
  notes,
  paymentSummary = [],
  onWhatsApp,
  style,
  className,
  children,
}: Props) {
  return (
    <ScrollView
      className={`flex-1 ${className ?? ''}`}
      style={style}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start pt-sm pb-[4px]">
        <View className="flex-1">
          <Text className="text-[28px] font-bold text-dark mb-[2px]">{customerName}</Text>
          <Text className="text-body text-gray mb-sm">{dateLabel}</Text>
          <View className="flex-row items-start gap-[6px] mb-sm">
            <Ionicons
              name={metaIcon === 'people' ? 'people' : 'calendar'}
              size={14}
              color="#666666"
            />
            <View className="flex-1">
              <Text className="text-[13px] text-[#444444] leading-[18px]">{metaLine1}</Text>
              {metaLine2 ? <Text className="text-[13px] text-[#444444] leading-[18px]">{metaLine2}</Text> : null}
            </View>
          </View>
          <StatusBadge
            label={STATUS_LABEL[status]}
            variant={STATUS_TO_BADGE[status] as any}
            style={{ marginTop: 4 }}
          />
        </View>
        {onWhatsApp ? (
          <TouchableOpacity onPress={onWhatsApp} activeOpacity={0.7} className="w-10 h-10 rounded-full bg-[#F0F0E8] items-center justify-center mt-[4px]">
            <Ionicons name="logo-whatsapp" size={22} color="#AAAAAA" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Info rows */}
      {infoRows.length > 0 ? (
        <View className="bg-card rounded-xl p-lg">
          {infoRows.map((row, i) => (
            <InfoRow
              key={i}
              label={row.label}
              value={row.value}
              isLast={i === infoRows.length - 1}
            />
          ))}
        </View>
      ) : null}

      {/* Services */}
      {services.length > 0 ? (
        <View className="bg-card rounded-xl p-lg">
          <Text className="text-body font-semibold text-dark mb-[10px]">Services</Text>
          {services.map((s, i) => (
            <View key={i} className="flex-row justify-between mb-[6px]">
              <Text className="text-body text-[#444444]">{s.name}</Text>
              <Text className="text-body text-dark font-medium">{s.price}</Text>
            </View>
          ))}
          {notes ? (
            <>
              <View className="h-px bg-[#E8E5D8] my-md" />
              <Text className="text-body font-semibold text-dark mb-[10px]">Notes</Text>
              <Text className="text-[13px] text-gray leading-[18px]">{notes}</Text>
            </>
          ) : null}
        </View>
      ) : null}

      {/* Payment Summary */}
      {paymentSummary.length > 0 ? (
        <View className="bg-card rounded-xl p-lg">
          <Text className="text-body font-semibold text-dark mb-[10px]">Payment Summary</Text>
          {paymentSummary.map((line, i) => (
            <View key={i} className="flex-row justify-between mb-[6px]">
              <Text className="text-body text-gray">{line.label}</Text>
              <Text className="text-body text-dark font-medium">{line.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {children}
    </ScrollView>
  );
}
