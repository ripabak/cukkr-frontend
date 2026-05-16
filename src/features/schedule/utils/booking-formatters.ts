import type { BookingStatus } from "@/src/components/BookingCard";
import type { BookingDetailStatus } from "@/src/features/schedule/components/BookingDetailCard";

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
  "in_progress": "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

const API_TO_DETAIL_STATUS: Record<string, BookingDetailStatus> = {
  pending: "waiting",
  requested: "requested",
  waiting: "waiting",
  "in_progress": "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

export function mapApiStatusToBookingStatus(status: ApiStatus | string): BookingStatus {
  return (API_TO_BOOKING_STATUS[status] as BookingStatus) ?? "waiting";
}

export function mapApiStatusToDetailStatus(status: ApiStatus | string): BookingDetailStatus {
  return (API_TO_DETAIL_STATUS[status] as BookingDetailStatus) ?? "waiting";
}

export function getDetailRouteForStatus(status: string): "/booking-detail-request" | "/booking-detail-in-progress" | "/booking-detail-result" | "/booking-detail-waiting" {
  if (status === "requested") return "/booking-detail-request";
  if (status === "in_progress") return "/booking-detail-in-progress";
  if (status === "completed" || status === "cancelled") return "/booking-detail-result";
  return "/booking-detail-waiting";
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

