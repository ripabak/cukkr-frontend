import { app } from "@/src/lib/eden-app";

export type AnalyticsRange = "24h" | "week" | "month" | "6m" | "1y";

export const analyticsService = {
  async getOverview(range: AnalyticsRange) {
    const { data: response, error } = await app.api.analytics.get({
      query: { range },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch analytics overview",
      );
    return response.data;
  },

  async getRevenue(range: AnalyticsRange) {
    const { data: response, error } = await app.api.analytics.revenue.get({
      query: { range },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch revenue analytics",
      );
    return response.data;
  },

  async getRevenueBookings(
    range: AnalyticsRange,
    type: "all" | "walk_in" | "appointment" = "all",
    page = 1,
    limit = 20,
  ) {
    const { data: response, error } =
      await app.api.analytics.revenue.bookings.get({
        query: { range, type, page, limit },
      });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch revenue bookings",
      );
    return { data: response.data, meta: response.meta };
  },

  async getCustomers(range: AnalyticsRange) {
    const { data: response, error } = await app.api.analytics.customers.get({
      query: { range },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch customers analytics",
      );
    return response.data;
  },

  async getCustomersList(
    range: AnalyticsRange,
    status: "all" | "new" | "return" = "all",
    page = 1,
    limit = 20,
  ) {
    const { data: response, error } =
      await app.api.analytics.customers.list.get({
        query: { range, status, page, limit },
      });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch customers list",
      );
    return { data: response.data, meta: response.meta };
  },

  async getBarbers(range: AnalyticsRange) {
    const { data: response, error } = await app.api.analytics.barbers.get({
      query: { range },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch barbers analytics",
      );
    return response.data;
  },

  async getBarbersList(range: AnalyticsRange) {
    const { data: response, error } = await app.api.analytics.barbers.list.get({
      query: { range },
    });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch barbers list");
    return response.data;
  },

  async getServices(range: AnalyticsRange) {
    const { data: response, error } = await app.api.analytics.services.get({
      query: { range },
    });
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch services analytics",
      );
    return response.data;
  },

  async getServicesList(range: AnalyticsRange, page = 1, limit = 20) {
    const { data: response, error } = await app.api.analytics.services.list.get(
      {
        query: { range, page, limit },
      },
    );
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch services list");
    return { data: response.data, meta: response.meta };
  },
};
