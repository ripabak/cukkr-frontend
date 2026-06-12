import { app } from "@/src/lib/eden-app";

type CustomerSort = "name_asc" | "recent" | "bookings_desc" | "spend_desc";

type BookingStatus =
  | "all"
  | "pending"
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

export const customersService = {
  async getList(options?: { search?: string; sort?: CustomerSort }) {
    const { data: response, error } = await app.api.customers.get({
      query: options,
    });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch customers");
    return response.data || [];
  },

  async getById(id: string) {
    const { data: response, error } = await app.api.customers({ id }).get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch customer");
    return response.data;
  },

  async getBookings(id: string, options?: { status?: BookingStatus }) {
    const { data: response, error } = await app.api
      .customers({ id })
      .bookings.get({ query: options });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch customer bookings",
      );
    return response.data || [];
  },
};
