import { AppTheme } from "@/src/app-theme";
import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";
import { StyleSheet, Text, View } from "react-native";

export default function StatsTab() {
  return (
    <WorkspaceRoute>
       <StatsScreen />
    </WorkspaceRoute>
  );
}

function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: AppTheme.colors.gray,
  },
});
