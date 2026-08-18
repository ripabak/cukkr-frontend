import { useQuery } from "@tanstack/react-query";
import { billingService } from "../services";

export const BILLING_QUERY_KEYS = {
  all: ["billing"] as const,
  plans: () => [...BILLING_QUERY_KEYS.all, "plans"] as const,
  subscription: () => [...BILLING_QUERY_KEYS.all, "subscription"] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.plans(),
    queryFn: () => billingService.getPlans(),
  });
}
