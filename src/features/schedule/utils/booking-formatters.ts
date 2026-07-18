import type { BookingStatus } from "@/src/components/BookingCard";
import type { BookingDetailStatus } from "@/src/features/schedule/components/BookingDetailCard";

type ApiStatus =
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

const API_TO_BOOKING_STATUS: Record<string, BookingStatus> = {
  requested: "requested",
  waiting: "waiting",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

const API_TO_DETAIL_STATUS: Record<string, BookingDetailStatus> = {
  requested: "requested",
  waiting: "waiting",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

export function mapApiStatusToBookingStatus(
  status: ApiStatus | string,
): BookingStatus {
  return (API_TO_BOOKING_STATUS[status] as BookingStatus) ?? "waiting";
}

export function mapApiStatusToDetailStatus(
  status: ApiStatus | string,
): BookingDetailStatus {
  return (API_TO_DETAIL_STATUS[status] as BookingDetailStatus) ?? "waiting";
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

type QueueBooking = {
  id: string;
  type: "walk_in" | "appointment";
  status: string;
  createdAt: Date;
  scheduledAt: Date | null;
  totalDuration: number;
  customerName: string;
  barber: { name: string } | null;
  source?: "customer" | "staff";
};

export function sortBookingsQueue<T extends QueueBooking>(bookings: T[]): T[] {
  const inProgress = bookings.filter((b) => b.status === "in_progress");
  const waiting = bookings.filter(
    (b) => b.status === "waiting",
  );
  const completed = bookings
    .filter((b) => b.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const cancelled = bookings
    .filter((b) => b.status === "cancelled")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return [
    ...inProgress,
    ...mergeWaitingQueue(waiting),
    ...completed,
    ...cancelled,
  ];
}

function mergeWaitingQueue<T extends QueueBooking>(bookings: T[]): T[] {
  const appointments = bookings
    .filter((b) => b.type === "appointment" && b.scheduledAt)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime(),
    );

  const walkIns = bookings
    .filter((b) => b.type === "walk_in" || !b.scheduledAt)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const merged: T[] = [];
  let apptIdx = 0;
  let walkinIdx = 0;
  let barberFreeAt = Date.now();

  while (apptIdx < appointments.length || walkinIdx < walkIns.length) {
    const nextAppt = appointments[apptIdx];
    const nextWalkin = walkIns[walkinIdx];

    if (!nextAppt) {
      merged.push(nextWalkin);
      walkinIdx++;
    } else if (!nextWalkin) {
      merged.push(nextAppt);
      barberFreeAt =
        Math.max(barberFreeAt, new Date(nextAppt.scheduledAt!).getTime()) +
        nextAppt.totalDuration * 60_000;
      apptIdx++;
    } else {
      const apptTime = new Date(nextAppt.scheduledAt!).getTime();
      const walkinArrived = new Date(nextWalkin.createdAt).getTime();
      const walkInFinishTime = barberFreeAt + nextWalkin.totalDuration * 60_000;

      if (walkinArrived <= apptTime && walkInFinishTime <= apptTime) {
        merged.push(nextWalkin);
        barberFreeAt = walkInFinishTime;
        walkinIdx++;
      } else {
        merged.push(nextAppt);
        barberFreeAt =
          Math.max(barberFreeAt, apptTime) + nextAppt.totalDuration * 60_000;
        apptIdx++;
      }
    }
  }

  return merged;
}
