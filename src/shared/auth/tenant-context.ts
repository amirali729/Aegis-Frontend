import { localStorageHelper } from "@/shared/storage/local-storage";

const TENANT_STORAGE_KEY = "tenant-id";

/**
 * Only relevant when the backend runs with MULTI_TENANT=true. In
 * self-hosted single-tenant mode this is simply never set and the
 * header is omitted, which has no effect on the backend.
 */
export function getTenantId(): string | null {
  return localStorageHelper.get<string>(TENANT_STORAGE_KEY);
}

export function setTenantId(tenantId: string): void {
  localStorageHelper.set(TENANT_STORAGE_KEY, tenantId);
}

export function clearTenantId(): void {
  localStorageHelper.remove(TENANT_STORAGE_KEY);
}