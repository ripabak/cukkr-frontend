import { useQuery } from "@tanstack/react-query";
import { barbershopService } from "../services/barbershop.service";

export const BARBERSHOP_QUERY_KEYS = {
  all: ["barbershop"] as const,
  current: () => [...BARBERSHOP_QUERY_KEYS.all, "current"] as const,
  slugCheck: (slug: string) =>
    [...BARBERSHOP_QUERY_KEYS.all, "slug-check", slug] as const,
};

export function useBarbershopCurrent() {
  return useQuery({
    queryKey: BARBERSHOP_QUERY_KEYS.current(),
    queryFn: () => barbershopService.getCurrent(),
  });
}

export function useBarbershopSlugCheck(slug: string) {
  return useQuery({
    queryKey: BARBERSHOP_QUERY_KEYS.slugCheck(slug),
    queryFn: () => barbershopService.checkSlugAvailability(slug),
    enabled: !!slug,
  });
}
