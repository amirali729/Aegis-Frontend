import { env } from "@/shared/config/env";

export const appConfig = {
  name: env.appName,
  version: env.appVersion,
  documentationUrl: env.documentationUrl,
  defaultTimezone: env.defaultTimezone,
} as const;