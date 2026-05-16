import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreateAppointmentPayload,
  CreateWalkInPayload,
  publicBookingService,
} from '../services/public-booking.service';

export const PUBLIC_BOOKING_QUERY_KEYS = {
  barbershop: (slug: string) => ['public-barbershop', slug] as const,
  formData: (slug: string) => ['public-form-data', slug] as const,
};

export function usePublicBarbershop(slug: string) {
  return useQuery({
    queryKey: PUBLIC_BOOKING_QUERY_KEYS.barbershop(slug),
    queryFn: () => publicBookingService.getBarbershopInfo(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}


export function usePublicFormData(slug: string) {
  return useQuery({
    queryKey: PUBLIC_BOOKING_QUERY_KEYS.formData(slug),
    queryFn: () => publicBookingService.getFormData(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useValidatePin(slug: string) {
  return useMutation({
    mutationFn: (pin: string) => publicBookingService.validatePin(slug, pin),
  });
}

export function useCreatePublicWalkIn(slug: string) {
  return useMutation({
    mutationFn: (payload: CreateWalkInPayload) =>
      publicBookingService.createWalkIn(slug, payload),
  });
}

export function useCreatePublicAppointment(slug: string) {
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      publicBookingService.createAppointment(slug, payload),
  });
}
