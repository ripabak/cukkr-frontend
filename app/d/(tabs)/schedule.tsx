import { PageTransition } from "@/src/components/PageTransition";
import { ScheduleActiveBookingsScreen } from "@/src/features/schedule/screens/ScheduleActiveBookingsScreen";

export default function ScheduleTab() {
  return (
    <PageTransition>
      <ScheduleActiveBookingsScreen />
    </PageTransition>
  );
}
