import { app } from "@/src/lib/eden-app";

export interface PlanDto {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

export const billingService = {
  async getPlans(): Promise<PlanDto[]> {
    const { data: response, error } = await app.api.billing.plans.get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch plans");
    return response.data as PlanDto[];
  },
};
