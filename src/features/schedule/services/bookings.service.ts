import { app } from "@/src/lib/eden-app";

type BookingApiStatus =
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CreateBookingPayload =
  | {
      customerName: string;
      serviceIds: string[];
      type: "walk_in";
      notes?: string | null;
      barberId?: string | null;
      customerEmail?: string | null;
      scheduledAt?: string | null;
    }
  | {
      customerName: string;
      serviceIds: string[];
      type: "appointment";
      scheduledAt: string;
      customerEmail?: string | null;
      notes?: string | null;
      barberId?: string | null;
    };

export const bookingsService = {
  async getBookings(
    date: string,
    options?: {
      status?: BookingApiStatus | "all";
      sort?: "oldest_first" | "recently_added";
      barberId?: string;
    },
  ) {
    const { data: response, error } = await app.api.bookings.get({
      query: {
        date,
        status: options?.status ?? "all",
        sort: options?.sort,
        barberId: options?.barberId,
      },
    });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch bookings");
    return response.data || [];
  },

  async getDateMarkers(dateFrom: string, dateTo: string) {
    const { data: response, error } = await app.api.bookings[
      "date-markers"
    ].get({
      query: { dateFrom, dateTo },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch date markers",
      );
    return response.data;
  },

  async getById(id: string) {
    const { data: response, error } = await app.api.bookings({ id }).get({});
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch booking");
    return response.data;
  },

  async create(payload: CreateBookingPayload) {
    const { data: response, error } = await app.api.bookings.post(payload);
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to create booking");
    return response.data;
  },

  async accept(id: string) {
    const { data: response, error } = await app.api
      .bookings({ id })
      .accept.post({});
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to accept booking");
    return response.data;
  },

  async decline(id: string, reason?: string) {
    const { data: response, error } = await app.api
      .bookings({ id })
      .decline.post({ reason });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to decline booking");
    return response.data;
  },

  async updateStatus(
    id: string,
    status: BookingApiStatus,
    cancelReason?: string | null,
  ) {
    const { data: response, error } = await app.api
      .bookings({ id })
      .status.patch({
        status,
        cancelReason,
      });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to update booking status",
      );
    return response.data;
  },

  async getInProgress() {
    const { data: response, error } = await app.api.bookings["in-progress"].get(
      {},
    );
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch in-progress booking",
      );
    return response.data;
  },

  async getRequestedBookings(dateFrom?: string, dateTo?: string) {
    const { data: response, error } = await app.api.bookings.requests.get({
      query: { dateFrom, dateTo },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch requested bookings",
      );
    return response.data ?? [];
  },
};
