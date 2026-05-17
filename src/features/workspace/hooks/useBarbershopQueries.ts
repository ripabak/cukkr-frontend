import { useQuery } from "@tanstack/react-query";
import { barbershopService } from "../services/barbershop.service";

export const BARBERSHOP_QUERY_KEYS = {
  all: ["barbershop"] as const,
  list: () => [...BARBERSHOP_QUERY_KEYS.all, "list"] as const,
  slugCheck: (slug: string) =>
    [...BARBERSHOP_QUERY_KEYS.all, "slug-check", slug] as const,
};

export function useBarbershopList(query?: string) {
  return useQuery({
    queryKey: BARBERSHOP_QUERY_KEYS.list(),
    queryFn: () => barbershopService.getList(query),
  });
}

export function useBarbershopSlugCheck(slug: string) {
  return useQuery({
    queryKey: BARBERSHOP_QUERY_KEYS.slugCheck(slug),
    queryFn: () => barbershopService.checkSlugAvailability(slug),
    enabled: !!slug,
  });
}
