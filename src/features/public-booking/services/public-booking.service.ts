const getApiUrl = () => (process.env.EXPO_PUBLIC_ENV_API_URL ?? '').replace(/\/$/, '');

export interface BarbershopPublicInfo {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
}

export interface PublicOpenHoursDay {
  dayOfWeek: number;
  isOpen: boolean;
  openTime?: string | null;
  closeTime?: string | null;
}

export interface PublicService {
  id: string;
  name: string;
  price: number;
  discountPercent?: number | null;
  imageUrl?: string | null;
  isDefault?: boolean;
}

export interface PublicBarber {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface PublicFormData {
  services: PublicService[];
  barbers: PublicBarber[];
}

export interface CreateWalkInPayload {
  validationToken: string;
  customerName: string;
  customerPhone?: string | null;
  serviceIds: string[];
  barberId?: string | null;
  notes?: string | null;
}

export interface CreateAppointmentPayload {
  customerName: string;
  customerPhone?: string | null;
  serviceIds: string[];
  barberId?: string | null;
  scheduledAt: string;
  notes?: string | null;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return (json?.data ?? json) as T;
}

export const publicBookingService = {
  async getBarbershopInfo(slug: string): Promise<BarbershopPublicInfo> {
    return apiFetch<BarbershopPublicInfo>(`${getApiUrl()}/api/public/barbershop/${slug}`);
  },

  async getDateAvailability(
    slug: string,
    date: string
  ): Promise<{ isOpen: boolean; openTime?: string | null; closeTime?: string | null } | null> {
    try {
      const res = await fetch(
        `${getApiUrl()}/api/public/barbershop/${slug}/availability?date=${date}`
      );
      const json = await res.json().catch(() => null);
      if (!res.ok || !json) return null;

      const raw = json?.data ?? json;

      // weekly array — find the matching day
      if (Array.isArray(raw)) {
        const d = new Date(date);
        const match = raw.find((day: any) => day.dayOfWeek === d.getDay());
        return match ?? null;
      }

      // single-day object
      if (raw && typeof raw === 'object' && 'isOpen' in raw) {
        return {
          isOpen: Boolean(raw.isOpen),
          openTime: raw.openTime ?? null,
          closeTime: raw.closeTime ?? null,
        };
      }

      return null;
    } catch {
      return null;
    }
  },

  async getFormData(slug: string): Promise<PublicFormData> {
    return apiFetch<PublicFormData>(`${getApiUrl()}/api/public/booking/${slug}/form-data`);
  },

  async validatePin(slug: string, pin: string): Promise<{ validationToken: string }> {
    return apiFetch<{ validationToken: string }>(
      `${getApiUrl()}/api/public/booking/${slug}/pin/validate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      }
    );
  },

  async createWalkIn(slug: string, payload: CreateWalkInPayload): Promise<unknown> {
    return apiFetch(`${getApiUrl()}/api/public/booking/${slug}/walk-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async createAppointment(slug: string, payload: CreateAppointmentPayload): Promise<unknown> {
    return apiFetch(`${getApiUrl()}/api/public/booking/${slug}/appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
};
