import { authClient } from "@/src/lib/auth-client";
import { app } from "@/src/lib/eden-app";

export const barbershopService = {
  async getList(query: string | undefined) {
    const { data: response, error } = await authClient.organization.list({
      query: { name: query },
    });
    if (error || !response) throw new Error("Failed to fetch barbershop list");
    return response || [];
  },

  async checkSlugAvailability(slug: string) {
    const { data: response, error } = await app.api.barbershop["slug-check"].get({
      query: { slug },
    });
    if (error || !response) throw new Error(error?.value?.message || "Failed to check slug availability");
    return response.data?.available || false;
  },
};
