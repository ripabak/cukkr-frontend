export interface TimeValue {
  hour: number;
  minute: number;
  amPm: "AM" | "PM";
}

/** "HH:MM" (24h) → TimeValue */
export function stringToTime(str: string): TimeValue {
  const [h, m] = str.split(":").map(Number);
  if (h === 0) return { hour: 12, minute: m, amPm: "AM" };
  if (h < 12) return { hour: h, minute: m, amPm: "AM" };
  if (h === 12) return { hour: 12, minute: m, amPm: "PM" };
  return { hour: h - 12, minute: m, amPm: "PM" };
}

/** TimeValue → "HH:MM" (24h) */
export function timeToString(t: TimeValue): string {
  let h = t.hour;
  if (t.amPm === "AM" && h === 12) h = 0;
  else if (t.amPm === "PM" && h !== 12) h = h + 12;
  return `${String(h).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

/** Default open/close time values */
export const DEFAULT_OPEN: TimeValue = { hour: 9, minute: 0, amPm: "AM" };
export const DEFAULT_CLOSE: TimeValue = { hour: 9, minute: 0, amPm: "PM" };

/** dayOfWeek number (0=Sun) to display label */
export const DAY_LABELS: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};
