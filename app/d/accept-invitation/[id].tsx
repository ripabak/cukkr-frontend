import { AcceptInvitationScreen } from "@/src/features/workspace/screens/AcceptInvitationScreen";
import { useLocalSearchParams } from "expo-router";

export default function AcceptInvitationPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AcceptInvitationScreen invitationId={id} />;
}
