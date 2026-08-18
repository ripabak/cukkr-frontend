import { PageTransition } from "@/src/components/PageTransition";
import { BarbershopSettingsScreen } from "@/src/features/barbershop/screens/BarbershopSettingsScreen";

export default function BarbershopTab() {
  return (
    <PageTransition>
      <BarbershopSettingsScreen />
    </PageTransition>
  );
}
