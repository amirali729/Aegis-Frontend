import type { AxiosRequestConfig } from "axios";

import { httpClient } from "@/shared/api/axios";
import type { ApiSuccessEnvelope } from "@/shared/api/response";

/**
 * Every feature's `api/*.ts` file should call through these helpers
 * instead of importing `httpClient` directly, so the `data` unwrapping
 * only happens in one place.
 */
export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.get<ApiSuccessEnvelope<T>>(url, config);
  return response.data.data;
}

export async function apiPost<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.post<ApiSuccessEnvelope<T>>(
    url,
    body,
    config,
  );
  return response.data.data;
}

export async function apiPatch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.patch<ApiSuccessEnvelope<T>>(
    url,
    body,
    config,
  );
  return response.data.data;
}

export async function apiPut<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.put<ApiSuccessEnvelope<T>>(
    url,
    body,
    config,
  );
  return response.data.data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.delete<ApiSuccessEnvelope<T>>(
    url,
    config,
  );
  return response.data.data;
}