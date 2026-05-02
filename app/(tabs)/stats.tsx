import { AppTheme } from "@/src/app-theme";
import { StyleSheet, Text, View } from "react-native";

export default function StatsTab() {
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
