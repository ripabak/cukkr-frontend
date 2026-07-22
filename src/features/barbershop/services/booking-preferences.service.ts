import { app } from "@/src/lib/eden-app";

export const bookingPreferencesService = {
  async getBookingWindow() {
    const { data: response, error } = await app.api.barbershop.get();
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to fetch booking window settings",
      );
    return {
      minAdvanceHours: response.data.minAdvanceHours,
      maxAdvanceDays: response.data.maxAdvanceDays,
    };
  },

  async updateBookingWindow(data: {
    minAdvanceHours: number;
    maxAdvanceDays: number;
  }) {
    const { data: response, error } =
      await app.api.barbershop.settings["booking-window"].patch(data);
    if (error || !response)
      throw new Error(
        error?.value?.message || "Failed to update booking window",
      );
    return response.data;
  },
};
