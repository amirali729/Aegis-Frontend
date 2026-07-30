import { ApiError } from "@/shared/errors/api-error";
import { NetworkError } from "@/shared/errors/network-error";

/**
 * Extracts a safe, human-readable message from any thrown value.
 * Use this at the UI boundary (toasts, form errors) instead of
 * reading `error.message` directly, since errors can come from
 * axios, ApiError, NetworkError, or arbitrary JS exceptions.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof NetworkError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}