import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '../services/organization.service';

const ORGANIZATION_QUERY_KEYS = {
  all: ['organization'] as const,
};

export function useCreateOrganization() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      slug: string;
      metadata?: {
        description?: string | null;
        address?: string | null;
      };
    }) => organizationService.create(data),
  });
}

export function useSetActiveOrganization() {
  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.setActive(organizationId),
  });
}

export { ORGANIZATION_QUERY_KEYS };
