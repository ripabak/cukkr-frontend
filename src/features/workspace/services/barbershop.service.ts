import { authClient } from "@/src/lib/auth-client";
import { app } from "@/src/lib/eden-app";

export const barbershopService = {

  async uploadLogo(file: File) {
    const { data: response, error } = await app.api.barbershop.logo.post({ file });

    if (error || !response) {
      throw new Error("Failed to upload logo");
    }
    return response.data;
  },

  async checkSlugAvailability(slug: string) {
    const { data: response, error } = await app.api.barbershop["slug-check"].get({
      query: { slug },
    });

    if (error || !response) {
      throw new Error("Failed to check slug availability");
    }
    return response.data?.available || false;
  },

  async getList(query: string | undefined) {
    const { data: response, error } = await authClient.organization.list({
      query: {
        name: query
      }
    })

    if (error || !response) {
      throw new Error("Failed to fetch barbershop list");
    }
    return response || [];
  },

  async getCurrent() {
    const { data: response, error } = await app.api.barbershop.get();

    if (error || !response) {
      throw new Error("Failed to fetch current barbershop");
    }
    return response.data;
  },

  async updateSettings(data: {
    name?: string;
    slug?: string;
    description?: string | null;
    address?: string | null;
    onboardingCompleted?: boolean;
  }) {
    const { data: response, error } = await app.api.barbershop.settings.patch(data);

    if (error || !response) {
      throw new Error("Failed to update settings");
    }
    return response.data;
  },

  async leave(orgId: string) {
    const { data: response, error } = await authClient.organization.leave({
      organizationId: orgId
    });

    if (error || !response) {
      throw new Error("Failed to leave barbershop");
    }
    return response;
  },
};
