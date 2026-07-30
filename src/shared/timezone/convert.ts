import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { getCurrentTimezone } from "@/shared/timezone/preferences";

/**
 * Converts a backend UTC timestamp (ISO string or Date) into a Date
 * object representing the same instant in the user's timezone.
 *
 * Backend UTC -> Convert -> User Timezone -> Display
 */
export function utcToUserTimezone(
  utcInput: string | Date,
  timezone: string = getCurrentTimezone(),
): Date {
  const date = typeof utcInput === "string" ? new Date(utcInput) : utcInput;
  return toZonedTime(date, timezone);
}

/**
 * Converts a Date picked in the user's local timezone back into a UTC
 * Date suitable for sending to the API.
 *
 * User Timezone -> Convert -> UTC -> API Request
 */
export function userTimezoneToUtc(
  localInput: Date,
  timezone: string = getCurrentTimezone(),
): Date {
  return fromZonedTime(localInput, timezone);
}

/** Convenience: converts a Date in the user's timezone directly to an ISO string for API payloads. */
export function toApiIsoString(
  localInput: Date,
  timezone: string = getCurrentTimezone(),
): string {
  return userTimezoneToUtc(localInput, timezone).toISOString();
}