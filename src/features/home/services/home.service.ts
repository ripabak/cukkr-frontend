import { app } from "@/src/lib/eden-app";

export const homeService = {
  async getBookingSummary(date: string) {
    const { data: response, error } = await app.api.bookings.summary.get({
      query: { dateFrom: date, dateTo: date },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch booking summary",
      );
    return response.data;
  },

  async getActiveBookings(date: string) {
    const { data: response, error } = await app.api.bookings.get({
      query: { date, status: "all" },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch active bookings",
      );
    return (response.data || []).filter(
      (b: { status: string }) =>
        b.status === "waiting" || b.status === "in_progress",
    );
  },

  async getCurrentPin() {
    const { data: response, error } = await app.api.pin.current.get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch current PIN");
    return response.data;
  },

  async generateWalkInPin() {
    const { data: response, error } = await app.api.pin.generate.post({});
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to generate PIN");
    return response.data;
  },
};
