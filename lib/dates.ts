import { DateTime } from "luxon";

// Returns the Monday (00:00) for the given date in Europe/London time
export function mondayOf(date: Date | string): string {
  const dt = DateTime.fromJSDate(
    date instanceof Date ? date : new Date(date),
    { zone: "Europe/London" }
  );
  return dt.startOf("week").toISODate()!;
}

// Returns the next Monday after a given date
export function nextMonday(date: Date | string): string {
  const dt = DateTime.fromJSDate(
    date instanceof Date ? date : new Date(date),
    { zone: "Europe/London" }
  );
  return dt.startOf("week").plus({ weeks: 1 }).toISODate()!;
}
