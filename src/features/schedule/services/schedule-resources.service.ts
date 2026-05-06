import { app } from "@/src/lib/eden-app";

export const scheduleResourcesService = {
  async getBarbers(search?: string) {
    const { data: response, error } = await app.api.barbers.get({
      query: { search, status: "active"  },
    });
    if (error || !response) throw new Error("Failed to fetch barbers");
    return response.data || [];
  },

  async getServices(search?: string) {
    const { data: response, error } = await app.api.services.get({
      query: { search, activeOnly: true },
    });
    if (error || !response) throw new Error("Failed to fetch services");
    return response.data || [];
  },
};
