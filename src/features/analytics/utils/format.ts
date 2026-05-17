export function formatRupiah(value: number): string {
  if (value >= 1_000_000) {
    const v = value / 1_000_000;
    const str = v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
    return `Rp${str}jt`;
  }
  if (value >= 1_000) {
    return `Rp${Math.round(value / 1_000)}k`;
  }
  return `Rp${value}`;
}

export function formatRupiahFull(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}

const RANGE_LABELS: Record<string, string> = {
  "24h": "last 24 hours",
  week: "this week",
  month: "this month",
  "6m": "last 6 months",
  "1y": "last year",
};

export function getRangeLabel(range: string): string {
  return RANGE_LABELS[range] ?? range;
}

import { formatDateTime } from "@/src/utils/date";

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return formatDateTime(new Date(iso));
}
