import { app } from "@/src/lib/eden-app";

export interface DayHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export const openHoursService = {
  async getList() {
    const { data: response, error } = await app.api["open-hours"].get();
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to fetch open hours");
    return response.data || [];
  },

  async update(days: DayHours[]) {
    const { data: response, error } = await app.api["open-hours"].put({ days });
    if (error || !response)
      throw new Error(error?.value?.message || "Failed to update open hours");
    return response.data;
  },
};
