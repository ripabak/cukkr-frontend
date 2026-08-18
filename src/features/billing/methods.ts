/**
 * Xendit payment channels — display-only for now.
 * When the real Xendit integration lands, the live channel list
 * comes from the gateway, not from this constant.
 */

export interface PaymentMethod {
  id: string;
  name: string;
  group: string;
}

export const PAYMENT_GROUPS = ["qris", "va", "ewallet", "retail", "card"] as const;

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "qris", name: "QRIS", group: "qris" },
  { id: "bca", name: "BCA", group: "va" },
  { id: "bni", name: "BNI", group: "va" },
  { id: "bri", name: "BRI", group: "va" },
  { id: "mandiri", name: "Mandiri", group: "va" },
  { id: "ovo", name: "OVO", group: "ewallet" },
  { id: "dana", name: "DANA", group: "ewallet" },
  { id: "gopay", name: "GoPay", group: "ewallet" },
  { id: "shopeepay", name: "ShopeePay", group: "ewallet" },
  { id: "alfamart", name: "Alfamart", group: "retail" },
  { id: "indomaret", name: "Indomaret", group: "retail" },
  { id: "card", name: "Credit/Debit Card", group: "card" },
];
