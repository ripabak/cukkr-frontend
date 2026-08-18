import { PageTransition } from "@/src/components/PageTransition";
import { AnalyticsOverviewScreen } from "@/src/features/analytics/screens/AnalyticsOverviewScreen";

export default function StatsTab() {
  return (
    <PageTransition>
      <AnalyticsOverviewScreen />
    </PageTransition>
  );
}
