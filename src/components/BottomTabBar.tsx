import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'home' | 'stats' | 'schedule' | 'profile';

interface Props {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
  style?: ViewStyle;
}

const TABS: { key: Tab; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'home', icon: 'home' },
  { key: 'stats', icon: 'bar-chart' },
  { key: 'schedule', icon: 'calendar' },
  { key: 'profile', icon: 'person' },
];

export function BottomTabBar({ activeTab, onTabPress, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <View style={[styles.iconCircle, isActive && styles.activeCircle]}>
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? '#1A1A1A' : '#666666'}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: '#C6FF4D',
  },
});
