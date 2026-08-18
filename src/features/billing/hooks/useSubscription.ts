import { useQuery } from "@tanstack/react-query";
import { billingService } from "../services";
import { BILLING_QUERY_KEYS } from "./usePlans";

export function useSubscription() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.subscription(),
    queryFn: () => billingService.getSubscription(),
    staleTime: 30_000,
  });
}