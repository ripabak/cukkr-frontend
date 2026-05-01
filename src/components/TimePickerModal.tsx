import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 3;

interface Props {
  visible: boolean;
  initialHour?: number;
  initialMinute?: number;
  initialAmPm?: 'AM' | 'PM';
  onConfirm: (hour: number, minute: number, amPm: 'AM' | 'PM') => void;
  onClose?: () => void;
  style?: ViewStyle;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AM_PM: ('AM' | 'PM')[] = ['AM', 'PM'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function ScrollPicker({
  items,
  selectedIndex,
  onSelect,
  renderItem,
}: {
  items: (number | string)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  renderItem: (item: number | string) => string;
}) {
  const flatRef = useRef<FlatList>(null);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    onSelect(clamped);
  };

  return (
    <View style={pickerStyles.col}>
      <FlatList
        ref={flatRef}
        data={items}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            onPress={() => {
              flatRef.current?.scrollToIndex({ index, animated: true });
              onSelect(index);
            }}
            style={pickerStyles.item}
          >
            <Text
              style={[
                pickerStyles.itemText,
                index === selectedIndex && pickerStyles.itemTextSelected,
              ]}
            >
              {renderItem(item)}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={pickerStyles.selectionBar} pointerEvents="none" />
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  col: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#B0ADA0',
    fontWeight: '400',
  },
  itemTextSelected: {
    fontSize: 22,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  selectionBar: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0DDD0',
  },
});

export function TimePickerModal({
  visible,
  initialHour = 9,
  initialMinute = 0,
  initialAmPm = 'AM',
  onConfirm,
  onClose,
  style,
}: Props) {
  const [hourIndex, setHourIndex] = useState(HOURS.indexOf(initialHour) >= 0 ? HOURS.indexOf(initialHour) : 0);
  const [minuteIndex, setMinuteIndex] = useState(initialMinute);
  const [amPmIndex, setAmPmIndex] = useState(initialAmPm === 'PM' ? 1 : 0);

  if (!visible) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.columns}>
        <ScrollPicker
          items={HOURS}
          selectedIndex={hourIndex}
          onSelect={setHourIndex}
          renderItem={(h) => pad(h as number)}
        />
        <Text style={styles.separator}>:</Text>
        <ScrollPicker
          items={MINUTES}
          selectedIndex={minuteIndex}
          onSelect={setMinuteIndex}
          renderItem={(m) => pad(m as number)}
        />
        <ScrollPicker
          items={AM_PM}
          selectedIndex={amPmIndex}
          onSelect={setAmPmIndex}
          renderItem={(a) => a as string}
        />
      </View>
      <TouchableOpacity
        onPress={() => onConfirm(HOURS[hourIndex], MINUTES[minuteIndex], AM_PM[amPmIndex])}
        activeOpacity={0.8}
        style={styles.confirmBtn}
      >
        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: 2,
  },
  confirmBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
