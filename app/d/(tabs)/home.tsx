import { PageTransition } from "@/src/components/PageTransition";
import { HomeDashboardScreen } from "@/src/features/home/screens/HomeDashboardScreen";

export default function HomeTab() {
  return (
    <PageTransition>
      <HomeDashboardScreen />
    </PageTransition>
  );
}
