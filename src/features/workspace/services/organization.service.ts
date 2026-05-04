import { authClient } from "@/src/lib/auth-client";

export const organizationService = {
  async create(data: {
    name: string;
    slug: string;
    metadata?: {
      description?: string | null;
      address?: string | null;
    };
  }) {
    const { data: response, error } = await authClient.organization.create(data);

    if (error || !response) {
      throw new Error(error?.message || "Failed to create organization");
    }
    return response;
  },

  async setActive(organizationId: string) {
    const { data: response, error } = await authClient.organization.setActive({
      organizationId,
    });

    if (error) {
      throw new Error(error.message || "Failed to set active organization");
    }
    return response;
  },
};
