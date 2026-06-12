import { useQuery } from "@tanstack/react-query";
import {
  analyticsService,
  type AnalyticsRange,
} from "../services/analytics.service";

export const ANALYTICS_KEYS = {
  overview: (range: AnalyticsRange) =>
    ["analytics", "overview", range] as const,
  revenue: (range: AnalyticsRange) => ["analytics", "revenue", range] as const,
  revenueBookings: (range: AnalyticsRange, type: string, page: number) =>
    ["analytics", "revenue-bookings", range, type, page] as const,
  customers: (range: AnalyticsRange) =>
    ["analytics", "customers", range] as const,
  customersList: (range: AnalyticsRange, status: string, page: number) =>
    ["analytics", "customers-list", range, status, page] as const,
  barbers: (range: AnalyticsRange) => ["analytics", "barbers", range] as const,
  barbersList: (range: AnalyticsRange) =>
    ["analytics", "barbers-list", range] as const,
  services: (range: AnalyticsRange) =>
    ["analytics", "services", range] as const,
  servicesList: (range: AnalyticsRange, page: number) =>
    ["analytics", "services-list", range, page] as const,
};

export function useAnalyticsOverview(range: AnalyticsRange) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.overview(range),
    queryFn: () => analyticsService.getOverview(range),
    staleTime: 60_000,
  });
}

export function useAnalyticsRevenue(range: AnalyticsRange) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.revenue(range),
    queryFn: () => analyticsService.getRevenue(range),
    staleTime: 60_000,
  });
}

export function useAnalyticsRevenueBookings(
  range: AnalyticsRange,
  type: "all" | "walk_in" | "appointment",
  page: number,
) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.revenueBookings(range, type, page),
    queryFn: () => analyticsService.getRevenueBookings(range, type, page),
    staleTime: 60_000,
  });
}

export function useAnalyticsCustomers(range: AnalyticsRange) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.customers(range),
    queryFn: () => analyticsService.getCustomers(range),
    staleTime: 60_000,
  });
}

export function useAnalyticsCustomersList(
  range: AnalyticsRange,
  status: "all" | "new" | "return",
  page: number,
) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.customersList(range, status, page),
    queryFn: () => analyticsService.getCustomersList(range, status, page),
    staleTime: 60_000,
  });
}

export function useAnalyticsBarbers(range: AnalyticsRange) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.barbers(range),
    queryFn: () => analyticsService.getBarbers(range),
    staleTime: 60_000,
  });
}

export function useAnalyticsBarbersList(range: AnalyticsRange) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.barbersList(range),
    queryFn: () => analyticsService.getBarbersList(range),
    staleTime: 60_000,
  });
}

export function useAnalyticsServices(range: AnalyticsRange) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.services(range),
    queryFn: () => analyticsService.getServices(range),
    staleTime: 60_000,
  });
}

export function useAnalyticsServicesList(range: AnalyticsRange, page: number) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.servicesList(range, page),
    queryFn: () => analyticsService.getServicesList(range, page),
    staleTime: 60_000,
  });
}
