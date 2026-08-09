import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { apiConfig } from "@/shared/config/api";
import { ApiError } from "@/shared/errors/api-error";
import { NetworkError } from "@/shared/errors/network-error";
import type { ApiErrorEnvelope } from "@/shared/api/response";
import { getTenantId } from "@/shared/auth/tenant-context";

/**
 * The single, shared Axios instance for the entire application.
 * Never create another axios instance — configure everything here.
 *
 * Auth is cookie-based (httpOnly accessToken/refreshToken), so
 * `withCredentials: true` is what makes the browser send/receive them.
 */
export const httpClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeoutMs,
  withCredentials: apiConfig.withCredentials,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tenantId = getTenantId();
  if (tenantId) {
    config.headers.set(apiConfig.headers.tenantId, tenantId);
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) config.headers.set("X-Timezone", timezone);
  } catch {
    // Intl may be unavailable in some environments; timezone header is best-effort.
  }

  return config;
});

/**
 * Requests that are paused while a token refresh is in flight, released
 * (or rejected) once the refresh settles. Ensures only one refresh call
 * is ever in flight at a time, and every request queued behind it gets
 * retried automatically once it succeeds.
 */
let isRefreshing = false;
let refreshWaiters: Array<() => void> = [];

function onRefreshed() {
  refreshWaiters.forEach((resolve) => resolve());
  refreshWaiters = [];
}

function waitForRefresh(): Promise<void> {
  return new Promise((resolve) => {
    refreshWaiters.push(resolve);
  });
}

const AUTH_ROUTES_EXCLUDED_FROM_REFRESH = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh",
  "/auth/logout",
];

function isExcludedFromRefresh(url?: string): boolean {
  if (!url) return false;
  return AUTH_ROUTES_EXCLUDED_FROM_REFRESH.some((route) =>
    url.includes(route),
  );
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // No response at all — connectivity issue, timeout, CORS failure, etc.
    if (!error.response) {
      return Promise.reject(new NetworkError());
    }

    const { status, data } = error.response;

    // /oauth/token, /oauth/revoke, /oauth/introspect are the three
    // documented exceptions to the standard {success, message, ...}
    // envelope — on failure they return RFC 6749-shaped
    // {error, error_description} instead of {message}. Checked with
    // `includes` rather than `startsWith` since these are called
    // against the bare, unversioned origin (see oauthOrigin in
    // o-auth.ts) — config.url for these calls is an absolute URL like
    // "https://api.example.com/oauth/token", not a relative path.
    const isRawOAuthEndpoint = Boolean(
      originalRequest?.url?.includes("/oauth/token") ||
        originalRequest?.url?.includes("/oauth/revoke") ||
        originalRequest?.url?.includes("/oauth/introspect"),
    );
    if (isRawOAuthEndpoint) {
      const oauthData = data as unknown as
        | { error?: string; error_description?: string }
        | undefined;
      return Promise.reject(
        new ApiError({
          message:
            oauthData?.error_description ??
            oauthData?.error ??
            error.message ??
            "The OAuth request failed.",
          statusCode: status,
        }),
      );
    }

    const shouldAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isExcludedFromRefresh(originalRequest.url);

    if (shouldAttemptRefresh) {
      originalRequest._retry = true;

      if (isRefreshing) {
        await waitForRefresh();
        return httpClient(originalRequest);
      }

      isRefreshing = true;

      try {
        await httpClient.post("/auth/refresh");
        isRefreshing = false;
        onRefreshed();
        return httpClient(originalRequest);
      } catch {
        isRefreshing = false;
        onRefreshed();
        // Refresh failed — the session is truly over. Let listeners
        // (the auth store) react by clearing state and redirecting.
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(
          new ApiError({
            message: "Your session has expired. Please log in again.",
            statusCode: 401,
          }),
        );
      }
    }

    const message =
      data?.message ?? error.message ?? "An unexpected error occurred.";

    return Promise.reject(
      new ApiError({
        message,
        statusCode: status,
        timestamp: data?.timestamp,
      }),
    );
  },
);