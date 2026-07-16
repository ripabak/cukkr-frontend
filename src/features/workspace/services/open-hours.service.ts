import {
  openHoursService as sharedOpenHoursService,
  type DayHours,
} from "@/src/services/open-hours.service";

export const openHoursService = {
  async update(days: DayHours[]) {
    return sharedOpenHoursService.update(days);
  },
};
