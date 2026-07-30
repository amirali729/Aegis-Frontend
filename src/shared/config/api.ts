import { env } from "@/shared/config/env";

export const apiConfig = {
  baseUrl: env.apiBaseUrl,
  timeoutMs: 15_000,
  withCredentials: true,
  headers: {
    tenantId: "X-Tenant-ID",
    apiKey: "X-API-Key",
    requestId: "X-Request-Id",
  },
} as const;