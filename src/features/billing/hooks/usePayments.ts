import { useQuery } from "@tanstack/react-query";
import { billingService } from "../services";
import { BILLING_QUERY_KEYS } from "./usePlans";

export function usePayments() {
  return useQuery({
    queryKey: [...BILLING_QUERY_KEYS.all, "payments"] as const,
    queryFn: () => billingService.getPayments(),
    staleTime: 30_000,
  });
}
