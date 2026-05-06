import type { BookingStatus } from "@/src/components/BookingCard";
import type { BookingDetailStatus } from "@/src/components/BookingDetailCard";

type ApiStatus =
  | "pending"
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

const API_TO_BOOKING_STATUS: Record<string, BookingStatus> = {
  pending: "waiting",
  requested: "requested",
  waiting: "waiting",
  in_progress: "in-progress",
  completed: "completed",
  cancelled: "canceled",
};

const API_TO_DETAIL_STATUS: Record<string, BookingDetailStatus> = {
  pending: "waiting",
  requested: "requested",
  waiting: "waiting",
  in_progress: "in-progress",
  completed: "completed",
  cancelled: "canceled",
};

export function mapApiStatusToBookingStatus(status: ApiStatus | string): BookingStatus {
  return (API_TO_BOOKING_STATUS[status] as BookingStatus) ?? "waiting";
}

export function mapApiStatusToDetailStatus(status: ApiStatus | string): BookingDetailStatus {
  return (API_TO_DETAIL_STATUS[status] as BookingDetailStatus) ?? "waiting";
}

export function getDetailRouteForStatus(status: string): string {
  if (status === "requested") return "/booking-detail-request";
  if (status === "in_progress") return "/booking-detail-in-progress";
  if (status === "completed" || status === "cancelled") return "/booking-detail-result";
  return "/booking-detail-waiting";
}

export function formatTimeLabel(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return formatDateShort(d);
}

export function formatDateLabel(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(d: Date): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} mins`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatPrice(amount: number): string {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}

export function formatScheduledTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const h = d.getHours();
  const m = d.getMinutes();
  const amPm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  const mm = m < 10 ? `0${m}` : String(m);
  return `${h12}:${mm} ${amPm}`;
}

export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
