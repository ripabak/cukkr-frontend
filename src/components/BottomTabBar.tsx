import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Tab = 'home' | 'stats' | 'schedule' | 'barbershop';

interface Props {
  activeTab: Tab;
  onTabPress?: (tab: Tab) => void;
  style?: ViewStyle;
}

const TABS: { key: Tab; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'home', icon: 'home' },
  { key: 'stats', icon: 'bar-chart' },
  { key: 'schedule', icon: 'calendar' },
  { key: 'barbershop', icon: 'storefront' },
];

export function BottomTabBar({ activeTab, onTabPress, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }, style]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabPress?.(tab.key)}
          activeOpacity={0.7}
          style={styles.tab}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={tab.key === activeTab ? Colors.brand.primary : Colors.icon.muted}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.default,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
});
