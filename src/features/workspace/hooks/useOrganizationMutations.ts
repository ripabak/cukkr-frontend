import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "../services/organization.service";

const ORGANIZATION_QUERY_KEYS = {
  all: ["organization"] as const,
};

// All workspace-scoped cache roots — invalidated when active workspace changes
const WORKSPACE_SCOPED_KEYS = [
  ["home"],
  ["barbershop"],
  ["barbershop-services"],
  ["barbershop-barbers"],
  ["barbershop-open-hours"],
  ["barbershop-customers"],
  ["schedule-bookings"],
  ["schedule-barbers"],
  ["schedule-services"],
  ["notifications"],
] as const;

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      slug: string;
      metadata?: {
        description?: string | null;
        address?: string | null;
      };
    }) => organizationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbershop"] });
    },
  });
}

export function useSetActiveOrganization() {
  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.setActive(organizationId),
    // Cache invalidation is handled by the caller AFTER getSession() completes,
    // so refetches always use the fresh session.
  });
}

export { ORGANIZATION_QUERY_KEYS, WORKSPACE_SCOPED_KEYS };
