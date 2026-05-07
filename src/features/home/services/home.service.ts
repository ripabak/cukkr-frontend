import { authClient } from "@/src/lib/auth-client";
import { app } from "@/src/lib/eden-app";

export const homeService = {
  async getBookingSummary(date: string) {
    const { data: response, error } = await app.api.bookings.summary.get({
      query: { dateFrom: date, dateTo: date },
    });
    if (error || !response) throw new Error("Failed to fetch booking summary");
    return response.data;
  },

  async getActiveBookings(date: string) {
    const { data: response, error } = await app.api.bookings.active.get({
      query: { date, status: "all" },
    });
    if (error || !response) throw new Error("Failed to fetch active bookings");
    return response.data || [];
  },

  async getCurrentBarbershop() {
    const { data: response, error } = authClient.useActiveOrganization();
    if (error || !response) throw new Error("Failed to fetch barbershop");
    return response;
  },

  async generateWalkInPin() {
    const { data: response, error } = await app.api.pin.generate.post({});
    if (error || !response) throw new Error("Failed to generate PIN");
    return response.data;
  },
};
