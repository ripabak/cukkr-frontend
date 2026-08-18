import { app } from "@/src/lib/eden-app";

export interface PlanDto {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  maxBarbershops: number | null;
  features: string[];
  /** Plan enterprise — tidak bisa dibeli langsung, hubungi tim Cukkr. */
  requiresContact: boolean;
}

export interface SubscriptionDto {
  planId: string;
  plan: PlanDto | null;
  status: "active" | "expired" | "free";
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
}

export interface CheckoutDto {
  invoiceId: string;
  xenditInvoiceId: string;
  invoiceUrl: string;
  planId: string;
  amount: number;
  currency: string;
}

export type PaymentStatus = "pending" | "paid" | "expired" | "failed";

export interface PaymentDto {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  invoiceUrl: string | null;
  xenditInvoiceId: string | null;
  paidAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export const billingService = {
  async getPlans(): Promise<PlanDto[]> {
    const { data: response, error } = await app.api.billing.plans.get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch plans");
    return response.data as PlanDto[];
  },

  async getSubscription(): Promise<SubscriptionDto> {
    const { data: response, error } = await app.api.billing.subscription.get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch subscription");
    return response.data as SubscriptionDto;
  },

  // Tagihan user — dipakai menampilkan invoice yang belum dibayar + tombol lanjut bayar.
  async getPayments(): Promise<PaymentDto[]> {
    const { data: response, error } = await app.api.billing.payments.get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch payments");
    return response.data as PaymentDto[];
  },

  async startCheckout(
    planId: "premium" | "business",
    paymentMethod: string
  ): Promise<CheckoutDto> {
    const { data: response, error } =
      await app.api.billing.subscription.checkout.post({
        planId,
        paymentMethod,
      });
    if (error || !response)
      throw new Error(error?.value?.message || "Checkout failed");
    return response.data as CheckoutDto;
  },
};