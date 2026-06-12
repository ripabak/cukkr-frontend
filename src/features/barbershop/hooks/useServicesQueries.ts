import { useQuery } from "@tanstack/react-query";
import { servicesService } from "../services/services.service";

type SortOption =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "recent";

export const SERVICES_QUERY_KEYS = {
  all: ["barbershop-services"] as const,
  list: (search?: string, sort?: SortOption) =>
    [...SERVICES_QUERY_KEYS.all, "list", search ?? "", sort ?? ""] as const,
  byId: (id: string) => [...SERVICES_QUERY_KEYS.all, "detail", id] as const,
};

export function useServicesList(options?: {
  search?: string;
  sort?: SortOption;
}) {
  return useQuery({
    queryKey: SERVICES_QUERY_KEYS.list(options?.search, options?.sort),
    queryFn: () => servicesService.getList(options),
  });
}

export function useServiceById(id: string) {
  return useQuery({
    queryKey: SERVICES_QUERY_KEYS.byId(id),
    queryFn: () => servicesService.getById(id),
    enabled: !!id,
  });
}
