import { Colors } from '@/src/theme/colors';
import { formatTime12h } from '@/src/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  bookingId: string;
  customerName: string;
  startedAt: Date | string | null;
}

function useElapsedTime(startedAt: Date | string | null) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const compute = () => {
      if (!startedAt) return '–';
      const start = new Date(startedAt as string);
      const diffSec = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000));
      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    };

    setElapsed(compute());
    const interval = setInterval(() => setElapsed(compute()), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return elapsed;
}

function formatStartTime(date: Date | string | null): string {
  if (!date) return '';
  return formatTime12h(new Date(date as string));
}

export function InProgressFloatingCard({ bookingId, customerName, startedAt }: Props) {
  const router = useRouter();
  const elapsed = useElapsedTime(startedAt);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 850, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const dotOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const shimmerOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.12] });

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/d/booking-detail", params: { id: bookingId } })}
      activeOpacity={0.85}
      style={styles.card}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: shimmerOpacity, backgroundColor: '#fff' }]} />

      <View style={styles.left}>
        <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
        <View style={styles.textGroup}>
          <Text style={styles.label}>In Progress</Text>
          <Text style={styles.name} numberOfLines={1}>{customerName}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.startTime}>{formatStartTime(startedAt)} → now</Text>
        <View style={styles.elapsedRow}>
          <Text style={styles.elapsed}>{elapsed}</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.status.inProgress,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  startTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
  },
  elapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  elapsed: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
