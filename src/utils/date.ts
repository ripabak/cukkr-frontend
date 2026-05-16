// ── Types ─────────────────────────────────────────────────────────────────────

export interface TimePoint {
  hour24: number;
  minute: number;
}

// ── Display formatters ─────────────────────────────────────────────────────────

/** "5s ago" / "30m ago" / "2h ago" / "5d ago" — pass createdAt from API */
export function formatRelativeTime(apiDate: Date | string): string {
  const diffSec = Math.floor((Date.now() - new Date(apiDate as string).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

/** "Sun, 15 Jan" — for date pills and header labels */
export function formatDisplayDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

/** "Sunday, 15 Jan 2025" — for booking detail card headers */
export function formatDateLabel(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** "15 Jan 2025" — for short date display */
export function formatDateShort(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** "15 Jan 2025, 09:30" — for history/analytics date-time labels */
export function formatDateTime(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${h}:${m}`;
}

/** "9:30 am" — 12-hour format from a Date (use for scheduledAt display) */
export function formatTime12h(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const amPm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  const mm = m < 10 ? `0${m}` : String(m);
  return `${h12}:${mm} ${amPm}`;
}

/** "9:30 AM" — display label from picker state values (h, m, amPm) */
export function formatPickerTime(h: number, m: number, amPm: "AM" | "PM"): string {
  const mm = m < 10 ? `0${m}` : String(m);
  return `${h}:${mm} ${amPm}`;
}

// ── Sending to API ─────────────────────────────────────────────────────────────

/** "2025-01-15" — local date as string for API query params (no timezone issue) */
export function toApiDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** ISO UTC string for user-selected datetime API body params */
export function toApiDateTime(date: Date, h: number, m: number, amPm: "AM" | "PM"): string {
  const hour24 = amPm === "AM" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
  const d = new Date(date);
  d.setHours(hour24, m, 0, 0);
  return d.toISOString();
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** "09:30" → { hour24: 9, minute: 30 } */
export function parseTime24(str: string): TimePoint {
  const [h, m] = str.split(":").map(Number);
  return { hour24: h, minute: m };
}

/** Convert 24-hour time to 12-hour picker initial state */
export function toInitial12h(hour24: number, minute: number): { hour: number; minute: number; amPm: "AM" | "PM" } {
  if (hour24 === 0) return { hour: 12, minute, amPm: "AM" };
  if (hour24 < 12) return { hour: hour24, minute, amPm: "AM" };
  if (hour24 === 12) return { hour: 12, minute, amPm: "PM" };
  return { hour: hour24 - 12, minute, amPm: "PM" };
}
