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

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${h}:${m}`;
}
