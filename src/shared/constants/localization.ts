export const SUPPORTED_TIMEZONES = [
  "UTC",
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Australia/Sydney",
] as const;

export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];

export const SUPPORTED_LOCALES = [
  { code: "en-US", label: "English (United States)" },
  { code: "en-GB", label: "English (United Kingdom)" },
  { code: "en-PK", label: "English (Pakistan)" },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]["code"];

export const DEFAULT_DATE_FORMAT = "MMM d, yyyy";
export const DEFAULT_TIME_FORMAT = "h:mm a";
export const DEFAULT_DATETIME_FORMAT = "MMM d, yyyy h:mm a";