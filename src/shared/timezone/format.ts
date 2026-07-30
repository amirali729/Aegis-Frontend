import { format as formatDate } from "date-fns";

import { utcToUserTimezone } from "@/shared/timezone/convert";
import {
  usePreferencesStore,
  getCurrentTimezone,
} from "@/shared/timezone/preferences";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATETIME_FORMAT,
  DEFAULT_TIME_FORMAT,
} from "@/shared/constants/localization";

/** Formats a backend UTC timestamp as a date in the user's timezone, e.g. "Jul 29, 2026". */
export function formatUtcDate(
  utcInput: string | Date,
  pattern: string = DEFAULT_DATE_FORMAT,
): string {
  return formatDate(utcToUserTimezone(utcInput), pattern);
}

/** Formats a backend UTC timestamp as a time in the user's timezone, e.g. "3:45 PM". */
export function formatUtcTime(
  utcInput: string | Date,
  pattern: string = DEFAULT_TIME_FORMAT,
): string {
  return formatDate(utcToUserTimezone(utcInput), pattern);
}

/** Formats a backend UTC timestamp as a full date + time in the user's timezone. */
export function formatUtcDateTime(
  utcInput: string | Date,
  pattern: string = DEFAULT_DATETIME_FORMAT,
): string {
  return formatDate(utcToUserTimezone(utcInput), pattern);
}

/** React hook variant that re-renders when the user changes their timezone/format preferences. */
export function useFormattedDateTime(utcInput: string | Date | null | undefined) {
  const { timezone, dateFormat, timeFormat } = usePreferencesStore();

  if (!utcInput) return { date: "—", time: "—", dateTime: "—" };

  const zoned = utcToUserTimezone(utcInput, timezone);

  return {
    date: formatDate(zoned, dateFormat),
    time: formatDate(zoned, timeFormat),
    dateTime: formatDate(zoned, `${dateFormat} ${timeFormat}`),
  };
}

export { getCurrentTimezone };