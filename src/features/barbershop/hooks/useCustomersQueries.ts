import { useQuery } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";

type CustomerSort = "name_asc" | "recent" | "bookings_desc" | "spend_desc";

export const CUSTOMERS_QUERY_KEYS = {
  all: ["barbershop-customers"] as const,
  list: (search?: string, sort?: CustomerSort, hasContact?: boolean) =>
    [
      ...CUSTOMERS_QUERY_KEYS.all,
      "list",
      search ?? "",
      sort ?? "",
      hasContact?.toString() ?? "",
    ] as const,
  byId: (id: string) => [...CUSTOMERS_QUERY_KEYS.all, "detail", id] as const,
  bookings: (id: string) =>
    [...CUSTOMERS_QUERY_KEYS.all, "bookings", id] as const,
};

export function useCustomersList(options?: {
  search?: string;
  sort?: CustomerSort;
  hasContact?: boolean;
}) {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEYS.list(
      options?.search,
      options?.sort,
      options?.hasContact,
    ),
    queryFn: () => customersService.getList(options),
  });
}

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEYS.byId(id),
    queryFn: () => customersService.getById(id),
    enabled: !!id,
  });
}

type BookingStatus =
  | "all"
  | "pending"
  | "requested"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled";

export function useCustomerBookings(id: string, options?: { status?: BookingStatus }) {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEYS.bookings(id),
    queryFn: () => customersService.getBookings(id, options),
    enabled: !!id,
  });
}
