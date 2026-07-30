/**
 * Centralized environment variable access.
 *
 * Never read `import.meta.env` anywhere else in the app — always go
 * through this module so env access stays typed and validated in one place.
 */

function readEnv(key: keyof ImportMetaEnv, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;

  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function readBoolEnv(key: keyof ImportMetaEnv, fallback = false): boolean {
  const value = import.meta.env[key] as string | undefined;
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

export const env = {
  appName: readEnv("VITE_APP_NAME", "Aegis"),
  appVersion: readEnv("VITE_APP_VERSION", "0.0.0"),
  apiBaseUrl: readEnv("VITE_API_BASE_URL", "http://localhost:5000/api/v1"),
  defaultTimezone: readEnv("VITE_DEFAULT_TIMEZONE", "UTC"),
  enableDevtools: readBoolEnv("VITE_ENABLE_DEVTOOLS", import.meta.env.DEV),
  enableAnalytics: readBoolEnv("VITE_ENABLE_ANALYTICS", false),
  sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? "",
  documentationUrl: readEnv(
    "VITE_DOCUMENTATION_URL",
    "https://docs.aegis.dev",
  ),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;