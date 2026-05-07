import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '../services/organization.service';

const ORGANIZATION_QUERY_KEYS = {
  all: ['organization'] as const,
};

// All workspace-scoped cache roots — invalidated when active workspace changes
const WORKSPACE_SCOPED_KEYS = [
  ['home'],
  ['barbershop'],
  ['barbershop-services'],
  ['barbershop-barbers'],
  ['barbershop-open-hours'],
  ['barbershop-customers'],
  ['schedule-bookings'],
  ['schedule-barbers'],
  ['schedule-services'],
  ['notifications'],
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
      queryClient.invalidateQueries({ queryKey: ['barbershop'] });
    },
  });
}

export function useSetActiveOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.setActive(organizationId),
    onSuccess: () => {
      WORKSPACE_SCOPED_KEYS.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

export { ORGANIZATION_QUERY_KEYS };
