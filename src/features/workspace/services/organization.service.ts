import { authClient } from "@/src/lib/auth-client";

export const organizationService = {
  async create(data: {
    name: string;
    // slug is required by Better Auth's TypeScript type; the backend
    // beforeCreateOrganization hook always overrides it with a unique slug.
    slug: string;
    metadata?: {
      description?: string | null;
      address?: string | null;
      timezone?: string | null;
    };
  }) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { data: response, error } = await authClient.organization.create({
      ...data,
      metadata: { ...data.metadata, timezone },
    });

    if (error || !response) {
      throw new Error(error?.message || "Failed to create organization");
    }
    return response;
  },

  async setActive(organizationId: string) {
    const { data: response, error } = await authClient.organization.setActive({
      organizationId,
    });

    if (error || !response) {
      throw new Error(error?.message || "Failed to set active organization");
    }
    return response;
  },
};
