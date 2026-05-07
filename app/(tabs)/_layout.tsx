import { BottomTabBar } from "@/src/components/BottomTabBar";
import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { View } from "react-native";

type Tab = "home" | "stats" | "schedule" | "barbershop";

const ROUTE_TO_TAB: Record<string, Tab> = {
  home: "home",
  stats: "stats",
  schedule: "schedule",
  barbershop: "barbershop",
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index].name;
  const activeTab = ROUTE_TO_TAB[activeRoute] ?? "home";

  return (
    <View style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={(tab) => navigation.navigate(tab)}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <WorkspaceRoute>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="stats" />
        <Tabs.Screen name="schedule" />
        <Tabs.Screen name="barbershop" />
      </Tabs>
    </WorkspaceRoute>
  );
}
