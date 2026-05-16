import { BottomTabBar } from "@/src/components/BottomTabBar";
import { InProgressFloatingCard } from "@/src/components/InProgressFloatingCard";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useInProgressBooking } from "@/src/features/schedule/hooks";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useColorScheme } from '@/src/components/useColorScheme';
import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";

type Tab = "home" | "stats" | "schedule" | "barbershop";

const ROUTE_TO_TAB: Record<string, Tab> = {
  home: "home",
  stats: "stats",
  schedule: "schedule",
  barbershop: "barbershop",
};

const TAB_TO_ROUTE: Record<Tab, string> = {
  home: "home",
  stats: "stats",
  schedule: "schedule",
  barbershop: "barbershop",
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index].name;
  const activeTab = ROUTE_TO_TAB[activeRoute] ?? "home";
  const { data: inProgressBooking } = useInProgressBooking();

  return (
    <View>
      {inProgressBooking ? (
        <InProgressFloatingCard
          bookingId={inProgressBooking.id}
          customerName={inProgressBooking.customer.name}
          startedAt={inProgressBooking.startedAt}
        />
      ) : null}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={(tab) => navigation.navigate(TAB_TO_ROUTE[tab])}
      />
    </View>
  );
}

// // You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  useColorScheme();

  return (
    <ProtectedRoute>
      <WorkspaceRoute>
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            headerShown: useClientOnlyValue(false, false),
          }}>
          <Tabs.Screen name="home" />
          <Tabs.Screen name="schedule" />
          <Tabs.Screen name="stats" />
          <Tabs.Screen name="barbershop" />
        </Tabs>
      </WorkspaceRoute>
    </ProtectedRoute>
  );
}
