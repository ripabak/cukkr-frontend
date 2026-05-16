import React, { createContext, useContext, useState } from 'react';

export interface PublicSelectedService {
  id: string;
  name: string;
  price: number;
  discountPercent?: number | null;
}

export interface PublicIdentity {
  name: string;
  phone: string;
}

export interface PublicBookingState {
  pin: string;
  validationToken: string | null;
  identity: PublicIdentity;
  serviceIds: string[];
  selectedServices: PublicSelectedService[];
  barberId: string | null;
  barberName: string | null;
  notes: string;
  scheduledAt: string | null;
  displayDateTime: string | null;
}

interface PublicBookingContextType {
  state: PublicBookingState;
  setPin: (pin: string) => void;
  setValidationToken: (token: string) => void;
  updateIdentity: (data: Partial<PublicIdentity>) => void;
  setServices: (services: PublicSelectedService[]) => void;
  setBarber: (id: string | null, name: string | null) => void;
  setScheduledAt: (iso: string, display: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

const defaultState: PublicBookingState = {
  pin: '',
  validationToken: null,
  identity: { name: '', phone: '' },
  serviceIds: [],
  selectedServices: [],
  barberId: null,
  barberName: null,
  notes: '',
  scheduledAt: null,
  displayDateTime: null,
};

const PublicBookingContext = createContext<PublicBookingContextType | undefined>(undefined);

export function PublicBookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PublicBookingState>(defaultState);

  const setPin = (pin: string) => setState(s => ({ ...s, pin }));

  const setValidationToken = (validationToken: string) =>
    setState(s => ({ ...s, validationToken }));

  const updateIdentity = (data: Partial<PublicIdentity>) =>
    setState(s => ({ ...s, identity: { ...s.identity, ...data } }));

  const setServices = (services: PublicSelectedService[]) =>
    setState(s => ({
      ...s,
      selectedServices: services,
      serviceIds: services.map(sv => sv.id),
    }));

  const setBarber = (barberId: string | null, barberName: string | null) =>
    setState(s => ({ ...s, barberId, barberName }));

  const setScheduledAt = (scheduledAt: string, displayDateTime: string) =>
    setState(s => ({ ...s, scheduledAt, displayDateTime }));

  const setNotes = (notes: string) => setState(s => ({ ...s, notes }));

  const reset = () => setState(defaultState);

  return (
    <PublicBookingContext.Provider
      value={{
        state,
        setPin,
        setValidationToken,
        updateIdentity,
        setServices,
        setBarber,
        setScheduledAt,
        setNotes,
        reset,
      }}
    >
      {children}
    </PublicBookingContext.Provider>
  );
}

export function usePublicBooking() {
  const ctx = useContext(PublicBookingContext);
  if (!ctx) throw new Error('usePublicBooking must be used within PublicBookingProvider');
  return ctx;
}
